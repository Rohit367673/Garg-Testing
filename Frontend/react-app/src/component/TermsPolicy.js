import React from 'react';
import { Container, Typography, Box, Divider } from '@mui/material';

const TermsAndPolicies = () => {
  return (
    <Container maxWidth="md">
      <Box my={4}>
        <Typography variant="h3" align="center" gutterBottom>
          Terms and Policies
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
            Welcome to Garg Exclusive, your premier source for a diverse range of branded clothing. We offer an exclusive selection from renowned labels such as Beatnik, Jhons Play, Gadoni, US Polo, and many more. Our commitment is to bring you the best in quality and style.
          </Typography>

          {/* About Us Section */}
          <Typography variant="h5" gutterBottom>
            About Us
          </Typography>
          <Typography variant="body1" paragraph>
            Garg Exclusive is an e-commerce platform based in Birta, Himachal Pradesh, India, dedicated to offering a wide array of apparel for men, women, and children. We collaborate with various well-known brands to ensure our customers receive high-quality products that meet their fashion needs.
          </Typography>

          {/* Terms of Use Section */}
          <Typography variant="h5" gutterBottom>
            Terms of Use
          </Typography>
          <Typography variant="body1" paragraph>
            By accessing and using our website, you agree to comply with and be bound by these terms and conditions. If you do not agree with these terms, please refrain from using our website. We reserve the right to update or modify these terms at any time without prior notice.
          </Typography>

          {/* Privacy Policy Section */}
          <Typography variant="h5" gutterBottom>
            Privacy Policy
          </Typography>
          <Typography variant="body1" paragraph>
            Your privacy is important to us. We collect personal information when you place an order, register on our site, or subscribe to our newsletter. This information is used solely to enhance your shopping experience and is handled with strict confidentiality. We do not share your personal data with third parties except as necessary to process your order or comply with legal obligations.
          </Typography>

          {/* Return Policy Section */}
          <Typography variant="h5" gutterBottom>
            Return Policy
          </Typography>
          <Typography variant="body1" paragraph>
            We strive to ensure your complete satisfaction with every purchase. If you are not entirely satisfied with your purchase, you may return the item under the following conditions:
          </Typography>
          <Typography variant="body1" component="ul">
            <li>The item must be returned within 7 days of the purchase date.</li>
            <li>The item must be in new, unused condition, with all original brand tags and labels attached.</li>
            <li>The item must be returned in its original packaging.</li>
            <li>Proof of purchase must be provided.</li>
          </Typography>
          <Typography variant="body1" paragraph>
            Please note that items that do not meet these criteria may not be eligible for a return or may be subject to a restocking fee. To initiate a return, please contact our customer service team at gargexclusive@gmail.com for further instructions.
          </Typography>

          {/* Intellectual Property Section */}
          <Typography variant="h5" gutterBottom>
            Intellectual Property
          </Typography>
          <Typography variant="body1" paragraph>
            All content on this website, including text, graphics, logos, images, and data compilations, is the property of Garg Exclusive or its content suppliers and is protected by applicable intellectual property laws.
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

export default TermsAndPolicies;
