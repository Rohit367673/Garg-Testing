import React from 'react';
import { Container, Typography, Box, Divider } from '@mui/material';

const TermsAndPolicy = () => {
  return (
    <Container maxWidth="md">
      <Box my={4}>
        <Typography variant="h3" align="center" gutterBottom>
          Terms and Policy
        </Typography>
        <Typography variant="subtitle1" align="center" gutterBottom>
          Garg Exclusive
        </Typography>
        <Divider variant="middle" />
        <Box mt={4}>
          {/* Introduction Section */}
          <Typography variant="h5" gutterBottom>
            Introduction
          </Typography>
          <Typography variant="body1" paragraph>
            Welcome to Garg Exclusive, your premier source for multiple brand cloths. We offer an exclusive range
            from renowned labels such as Beatnik, Jhons Play, Gadoni, US Polo, and many more. Our commitment is to
            bring you the best in quality and style.
          </Typography>

          {/* About Us Section */}
          <Typography variant="h5" gutterBottom>
            About Us
          </Typography>
          <Typography variant="body1" paragraph>
            Garg Exclusive is an ecommerce platform based in Birta, Himachal Pradesh, India, dedicated to offering a
            diverse range of apparel for men, women, and children. We partner with various well-known brands to ensure
            our customers receive high-quality products that meet their fashion needs.
          </Typography>

          {/* Terms of Use Section */}
          <Typography variant="h5" gutterBottom>
            Terms of Use
          </Typography>
          <Typography variant="body1" paragraph>
            By accessing and using our website, you agree to comply with and be bound by these terms and conditions.
            If you do not agree with these terms, please refrain from using our website. We reserve the right to update
            or modify these terms at any time without prior notice.
          </Typography>

          {/* Privacy Policy Section */}
          <Typography variant="h5" gutterBottom>
            Privacy Policy
          </Typography>
          <Typography variant="body1" paragraph>
            Your privacy is important to us. We collect personal information when you place an order, register on our site,
            or subscribe to our newsletter. This information is used solely to improve your shopping experience and is
            handled in strict confidence. We do not share your personal data with third parties except as necessary to
            process your order or comply with legal obligations.
          </Typography>

          {/* Intellectual Property Section */}
          <Typography variant="h5" gutterBottom>
            Intellectual Property
          </Typography>
          <Typography variant="body1" paragraph>
            All content on this website, including text, graphics, logos, images, and data compilations, is the property
            of Garg Exclusive or its content suppliers and is protected by applicable intellectual property laws.
          </Typography>

          {/* Contact Information Section */}
          <Typography variant="h5" gutterBottom>
            Contact Information
          </Typography>
          <Typography variant="body1" paragraph>
            If you have any questions or concerns regarding these terms and policies, please contact us at:
          </Typography>
          <Typography variant="body1" paragraph>
            Email: gargexclusive@gmail.com<br />
            Address: Birta, Himachal Pradesh, India
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default TermsAndPolicy;
