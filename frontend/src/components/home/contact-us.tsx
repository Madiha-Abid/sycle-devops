import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

const styles = {
  contactUsContainer: {
    backgroundImage: "url('https://images.unsplash.com/photo-1462392246754-28dfa2df8e6b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactUsContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: '2rem',
    borderRadius: '8px',
  },
  text: {
    fontFamily: 'Didot',
  },
};

function ContactUs() {
  return (
    <div style={styles.contactUsContainer}>
      <Container maxWidth="sm">
        <div className="contact-us-content" style={styles.contactUsContent}>
          <Typography variant="h4" gutterBottom style={styles.text}>
            Contact SYCLE
          </Typography>
          <Typography variant="body1" paragraph style={styles.text}>
            Email: sycle@gmail.com
          </Typography>
          <Typography variant="body1" paragraph style={styles.text}>
            Phone: +1 123-456-7890
          </Typography>
          <Typography variant="body1" paragraph style={styles.text}>
            Address: 1234 Main Street, Karachi, Sindh, Pakistan
          </Typography>
          <Typography variant="body1" paragraph style={styles.text}>
            Have any questions or feedback? Feel free to reach out to us. We are here to assist you.
          </Typography>
        </div>
      </Container>
    </div>
  );
}

export default ContactUs;
