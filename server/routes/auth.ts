
import express from 'express';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { createUser, findUserByLarkId } from '../models/user';

const router = express.Router();

// Store states temporarily for validation
const stateStore: Record<string, { expiry: number }> = {};

// Authentication routes
router.get('/auth/lark/login', (req, res) => {
  const state = uuidv4();
  
  // Store state with 10 minute expiry
  stateStore[state] = { expiry: Date.now() + 10 * 60 * 1000 };
  
  // Clean up expired states
  Object.keys(stateStore).forEach(key => {
    if (stateStore[key].expiry < Date.now()) {
      delete stateStore[key];
    }
  });
  
  // Build authorization URL
  const authUrl = new URL('https://open.larksuite.com/open-apis/authen/v1/authorize');
  authUrl.searchParams.append('app_id', process.env.LARK_APP_ID || '');
  authUrl.searchParams.append('redirect_uri', `${process.env.SERVER_URL || 'http://localhost:5000'}/api/auth/callback`);
  authUrl.searchParams.append('response_type', 'code');
  authUrl.searchParams.append('state', state);
  
  res.json({ authUrl: authUrl.toString(), state });
});

// Handle the Lark OAuth callback
router.get('/auth/callback', async (req, res) => {
  try {
    const { code, state } = req.query;
    
    // Validate state if present
    if (state && typeof state === 'string' && stateStore[state]) {
      // Remove state from store
      delete stateStore[state];
    } else {
      console.warn('Invalid or missing state parameter');
      // Redirect to frontend error page
      return res.redirect(`${process.env.CLIENT_URL || 'http://localhost:8080'}/auth/error?error=invalid_state`);
    }
    
    // No code provided
    if (!code || typeof code !== 'string') {
      return res.redirect(`${process.env.CLIENT_URL || 'http://localhost:8080'}/auth/error?error=invalid_code`);
    }
    
    // Exchange code for token
    const tokenResponse = await axios.post(
      'https://open.larksuite.com/open-apis/authen/v1/access_token',
      {
        grant_type: 'authorization_code',
        code,
        app_id: process.env.LARK_APP_ID,
        app_secret: process.env.LARK_APP_SECRET,
      }
    );
    
    if (!tokenResponse.data || !tokenResponse.data.data || !tokenResponse.data.data.access_token) {
      console.error('Invalid token response:', tokenResponse.data);
      return res.redirect(`${process.env.CLIENT_URL || 'http://localhost:8080'}/auth/error?error=token_exchange_failed`);
    }
    
    const { access_token } = tokenResponse.data.data;
    
    // Get user info
    const userResponse = await axios.get(
      'https://open.larksuite.com/open-apis/authen/v1/user_info',
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    
    if (!userResponse.data || !userResponse.data.data) {
      console.error('Invalid user response:', userResponse.data);
      return res.redirect(`${process.env.CLIENT_URL || 'http://localhost:8080'}/auth/error?error=user_info_failed`);
    }
    
    const userData = userResponse.data.data;
    
    // Check if user exists, create if not
    let user = await findUserByLarkId(userData.user_id);
    
    if (!user) {
      // Create new user
      user = await createUser({
        larkId: userData.user_id,
        email: userData.email || '',
        name: userData.name || userData.user_id,
        avatar: userData.avatar_url || '',
        larkAccessToken: access_token,
      });
    } else {
      // Update access token
      user.larkAccessToken = access_token;
      await user.save();
    }
    
    // Generate JWT
    const token = jwt.sign(
      { 
        id: user._id,
        larkId: user.larkId,
        email: user.email,
        name: user.name
      }, 
      process.env.JWT_SECRET || '', 
      { expiresIn: '7d' }
    );
    
    // Redirect to frontend with token
    res.redirect(`${process.env.CLIENT_URL || 'http://localhost:8080'}/auth/success?token=${token}`);
  } catch (error) {
    console.error('Lark authentication error:', error);
    res.redirect(`${process.env.CLIENT_URL || 'http://localhost:8080'}/auth/error?error=auth_failed`);
  }
});

export default router;
