import Colors from "../constants/Colors";

function Header() {
  return (
    <header style={styles.header}>
      <h1 style={styles.title}>
        Fiz Tarefa
      </h1>
      <p style={styles.subtitle}>
        Organize seu dia, conclua metas e gerencie seu tempo.
      </p>
    </header>
  );
}

export default Header;

const styles = {
   header: {
    background: Colors.orange.orangeStandard,
    padding: '40px 20px',
    borderRadius: '8px',
    marginBottom: '30px',
    boxShadow: '0 6px 12px rgba(205, 0, 0, 0.2)',
    textAlign: 'center',
    color: '#fff',
    fontFamily: 'Arial, sans-serif',
    width: '100vw',         
    marginLeft: 'calc(-50vw + 50%)' 
            },
    title: {
        margin: 0,
        fontSize: '2rem',
        letterSpacing: '1px'
            },
    subtitle: 
            {
        marginTop: '8px',
        fontSize: '1rem',
        opacity: 0.9
            }
};
