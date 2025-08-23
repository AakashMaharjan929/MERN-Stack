import React from 'react'

const ProfileCard = ({ name, age, bio, number }) => {
  return (
    <div style={styles.card}>
      <h2 style={styles.name}>{name}</h2>
      <p style={styles.detail}>Age: <span style={styles.value}>{age}</span></p>
      <p style={styles.detail}>Bio: <span style={styles.value}>{bio}</span></p>
      <p style={styles.detail}>Number: <span style={styles.value}>{number}</span></p>
    </div>
  )
}

const App = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Profile Card App</h1>
      <div style={styles.cardContainer}>
        <ProfileCard
          name="Aakash Maharjan"
          age={21}
          bio="Full Stack Developer"
          number="9876543210"
        />
        <ProfileCard
          name="John Doe"
          age={30}
          bio="Software Engineer"
          number="123-456-7890"
        />
        <ProfileCard
          name="Alice Smith"
          age={28}
          bio="Data Scientist"
          number="2112-123-4567"
        />
        <ProfileCard
          name="Bob Johnson"
          age={35}
          bio="Product Manager"
          number="987-654-3210"
        />
        <ProfileCard
          name="Charlie Brown"
          age={22}
          bio="Graphic Designer"
          number="321-654-9870"
        />
      </div>
    </div>
  )
}

export default App

// Inline styles
const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    textAlign: 'center',
    padding: '20px',
    background: '#f4f6f9',
    minHeight: '100vh',
  },
  title: {
    fontSize: '2.2rem',
    marginBottom: '30px',
    color: '#444',
  },
  cardContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  card: {
    background: '#fff',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    textAlign: 'left',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  },
  name: {
    fontSize: '1.5rem',
    marginBottom: '10px',
    color: '#2c3e50',
  },
  detail: {
    margin: '6px 0',
    color: '#555',
    fontSize: '1rem',
  },
  value: {
    fontWeight: 'bold',
    color: '#000',
  },
}
