import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

const styles = {
  aboutUsContainer: {
    backgroundImage: "url('https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aboutUsContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: '2rem',
    borderRadius: '8px',
  },
  text: {
    fontFamily: 'Didot',
  },
};

function AboutUs() {
  return (
    <div style={styles.aboutUsContainer}>
      <Container maxWidth="sm">
        <div className="about-us-content" style={styles.aboutUsContent}>
          <Typography variant="h4" gutterBottom style={styles.text}>
            About SYCLE
          </Typography>
          <Typography variant="body1" paragraph style={styles.text}>
            SYCLE is an online platform that supports sustainability by providing a platform to resell old and hardly worn clothes. We believe in the power of reusing and reducing waste. Our mission is to connect sellers with buyers and encourage a circular economy for fashion.
          </Typography>
          <Typography variant="body1" paragraph style={styles.text}>
            At SYCLE, sellers and buyers can negotiate prices by giving each other offers and counteroffers. It's a collaborative process that allows both parties to find a mutually beneficial agreement.
          </Typography>
          <Typography variant="body1" paragraph style={styles.text}>
            We operate in major cities of Pakistan, making it convenient for people to participate in sustainable fashion practices. Our focus is on promoting sustainability and creating a positive impact on the environment.
          </Typography>
          <Typography variant="body1" paragraph style={styles.text}>
            Join SYCLE, where fashion meets sustainability, and be a part of the movement towards a more conscious and eco-friendly way of shopping.
          </Typography>
        </div>
      </Container>
    </div>
  );
}

export default AboutUs;
