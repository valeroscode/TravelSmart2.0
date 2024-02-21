import React from 'react';

const Footer = () => {
  const footerStyle = {
    backgroundColor: '#222',
    color: '#fff',
    padding: '40px 20px',
    textAlign: 'center',
    borderTop: '1px solid #444',
  };

  const footerContentStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  };

  const footerSectionStyle = {
    flex: 1,
    margin: '0 10px',
  };

  const footerLogoStyle = {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '10px',
  };

  const footerLinksStyle = {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  };

  const footerLinksItemStyle = {
    marginBottom: '8px',
  };

  const footerLinksAnchorStyle = {
    color: '#fff',
    textDecoration: 'none',
    fontSize: '14px',
  };

  const footerContactStyle = {
    fontSize: '14px',
    lineHeight: '1.6',
  };

  const footerSocialStyle = {
    marginTop: '20px',
  };

  const footerSocialAnchorStyle = {
    display: 'inline-block',
    marginRight: '10px',
    color: '#fff',
    textDecoration: 'none',
    fontSize: '20px',
  };

  return (
    <footer style={footerStyle}>
      <div style={footerContentStyle}>
        <div style={footerSectionStyle}>
          <p style={footerLogoStyle}>Your Logo</p>
          <ul style={footerLinksStyle}>
            <li style={footerLinksItemStyle}><a href="#" style={footerLinksAnchorStyle}>Home</a></li>
            <li style={footerLinksItemStyle}><a href="#" style={footerLinksAnchorStyle}>About Us</a></li>
            <li style={footerLinksItemStyle}><a href="#" style={footerLinksAnchorStyle}>Services</a></li>
            <li style={footerLinksItemStyle}><a href="#" style={footerLinksAnchorStyle}>Contact</a></li>
          </ul>
        </div>
        <div style={footerSectionStyle}>
          <h3>Contact Us</h3>
          <p style={footerContactStyle}>Your Address<br />Phone: xxx-xxx-xxxx<br />Email: info@example.com</p>
        </div>
        <div style={footerSectionStyle}>
          <h3>Follow Us</h3>
          <div style={footerSocialStyle}>
            <a href="#" target="_blank" style={footerSocialAnchorStyle}>Facebook</a>
            <a href="#" target="_blank" style={footerSocialAnchorStyle}>Twitter</a>
            <a href="#" target="_blank" style={footerSocialAnchorStyle}>Instagram</a>
          </div>
        </div>
      </div>
      <p style={{ fontSize: '14px' }}>&copy; 2023 Your Website. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
