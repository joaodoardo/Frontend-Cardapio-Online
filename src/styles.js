// Arquivo central para todos os estilos da aplicação.
const styles = {
  container: { width: '100%', maxWidth: '1280px', margin: '0 auto', padding: '0 1rem', boxSizing: 'border-box' },
  button: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: 500, padding: '0.5rem 1rem', border: 'none', cursor: 'pointer', transition: 'background-color 0.2s' },
  buttonPrimary: { backgroundColor: '#EA580C', color: 'white' },
  buttonSecondary: { backgroundColor: '#E5E7EB', color: '#1F2937' },
  buttonDestructive: { backgroundColor: '#DC2626', color: 'white' },
  buttonGhost: { backgroundColor: 'transparent' },
  card: { backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #E5E7EB', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' },
  input: {display: 'flex', height: '2.5rem', width: '100%', borderRadius: '0.375rem', border: '1px solid #D1D5DB', backgroundColor: 'white', padding: '0.5rem 0.75rem', fontSize: '0.875rem', boxSizing: 'border-box', color: 'black' },
  label: { fontSize: '0.875rem', fontWeight: 500, color: '#374151', display: 'block', marginBottom: '0.5rem' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 50, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem' },
  modalContent: { backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', width: '100%', maxWidth: '500px', margin: 'auto' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderBottom: '1px solid #E5E7EB' },
  modalBody: { padding: '1.5rem' },
  table: { width: '100%', fontSize: '0.875rem', textAlign: 'left', color: '#4B5563', borderCollapse: 'collapse' },
  tableHead: { fontSize: '0.75rem', color: '#374151', textTransform: 'uppercase', backgroundColor: '#F9FAFB' },
  tableHeadCell: { padding: '0.75rem 1.5rem' },
  tableBodyRow: { backgroundColor: 'white', borderBottom: '1px solid #E5E7EB' },
  tableBodyCell: { padding: '1rem 1.5rem' },
};

export default styles;