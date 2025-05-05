import React from 'react';
import { FacebookOutlined, InstagramOutlined } from '@ant-design/icons';

export default function Footer() {
  return (
    <footer
      style={{
        background: 'linear-gradient(135deg, #000000, #16a34a)',
        color: '#ffffff',
        padding: '20px 0',
        textAlign: 'center',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <div className="container p-4">
        <div className="row">
          <div className="col-12 col-lg-4 col-md-6 col-sm-12">
            <h5>About our store</h5>
            <p>
              Sharki is owned by Muhammad Shafay. <br /> Marketing Manager is Abdul Wasay.
            </p>
            <h5>Social Accounts</h5>
            <p className='mt-2'>
              <a href='https://www.instagram.com/premium_pakistan/' target="_blank" rel="noopener noreferrer">
                <InstagramOutlined style={{ fontSize: '24px', color: '#C13584', marginRight: '10px' }} />
              </a>
              <a href='https://www.facebook.com/profile.php?id=61574013609695' target="_blank" rel="noopener noreferrer">
                <FacebookOutlined style={{ fontSize: '24px', color: '#3b5998' }} />
              </a>
            </p>
          </div>
          <div className="col-12 col-lg-4 col-md-6 col-sm-12">
            <h5>Policies</h5>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li>Contact Information</li>
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
            </ul>
          </div>
          <div className="col-12 col-lg-4 col-md-6 col-sm-12">
            <h5>Get Notified</h5>
            <p>
              If you want to get emails about our latest articles and sales, enter your email to receive offers.
            </p>
            <input
              className='w-100 mb-2'
              type="email"
              placeholder='Enter your email'
              style={{ borderRadius: '9px', height: '40px', padding: '10px', border: 'none' }}
            />
            <button
              className='btn w-100'
              style={{
                backgroundColor: '#22c55e',
                color: 'white',
                borderRadius: '9px',
                padding: '10px',
                border: 'none',
                transition: 'background-color 0.3s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#16a34a')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#22c55e')}
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}