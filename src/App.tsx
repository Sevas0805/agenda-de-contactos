import { useState, useRef } from 'react'
import { Contact } from './types/Contact.tsx'
import ContactForm from './components/ContactForm'
import ContactList from './components/ContactList'
import SearchBar from './components/SearchBar'
import ThemeToggle from './components/ThemeToggle'
import './App.css'

function App() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [editingContact, setEditingContact] = useState<Contact | null>(null)
  const [error, setError] = useState('')
  const errorTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showError = (msg: string) => {
    setError(msg);
    if (errorTimeout.current) clearTimeout(errorTimeout.current);
    errorTimeout.current = setTimeout(() => setError(''), 3000);
  };

  const handleAddContact = (contact: Omit<Contact, 'id'>) => {
    const exists = contacts.some(c =>
      c.name.trim().toLowerCase() === contact.name.trim().toLowerCase() &&
      c.surname.trim().toLowerCase() === contact.surname.trim().toLowerCase() &&
      c.email.trim().toLowerCase() === contact.email.trim().toLowerCase() &&
      c.phone.trim() === contact.phone.trim()
    );
    if (exists) {
      showError('Este contacto ya existe en la lista.');
      return;
    }
    const newContact: Contact = {
      ...contact,
      id: Date.now().toString()
    }
    setContacts([...contacts, newContact])
  }

  const handleDeleteContact = (id: string) => {
    setContacts(contacts.filter(contact => contact.id !== id))
  }

  const handleEditContact = (contact: Contact) => {
    setEditingContact(contact)
  }

  const handleUpdateContact = (updatedContact: Contact) => {
    setContacts(contacts.map(contact => contact.id === updatedContact.id ? updatedContact : contact))
    setEditingContact(null)
  }

  const filteredContacts = contacts.filter(contact => {
    const term = searchTerm.toLowerCase()
    return (
      contact.name.toLowerCase().includes(term) ||
      contact.surname.toLowerCase().includes(term) ||
      contact.email.toLowerCase().includes(term) ||
      contact.phone.toLowerCase().includes(term)
    )
  })

  return (
    <div className="app">
      <header className="app-header">
        <h1>Agenda de Contactos</h1>
        <ThemeToggle />
      </header>
      
      <main className="app-main">
        <section className="form-section">
          <h2>{editingContact ? 'Editar Contacto' : 'Agregar Contacto'}</h2>
          <ContactForm 
            onSubmit={handleAddContact}
            editingContact={editingContact}
            onUpdate={handleUpdateContact}
            onCancelEdit={() => setEditingContact(null)}
          />
          {error && <div className="error-toast">{error}</div>}
        </section>

        <section className="contacts-section">
          <h2>Lista de Contactos</h2>
          <SearchBar 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
          <ContactList 
            contacts={filteredContacts}
            onDelete={handleDeleteContact}
            onEdit={handleEditContact}
          />
        </section>
      </main>
    </div>
  )
}

export default App
