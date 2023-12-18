import React, { useState, useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import axios from 'axios';
import videoSource from '../video/video.mp4'
import '@fortawesome/fontawesome-free/css/all.css';
import { DndProvider } from 'react-dnd';


const DraggableCard = ({ card, index, moveCard,onCardAction }) => {
  const [, ref] = useDrag({
    type: 'CARD',
    item: { index },
  });

  const [, drop] = useDrop({
    accept: 'CARD',
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveCard(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <div ref={(node) => ref(drop(node))} className='maincard'>
      <div className="card-options">
        <button onClick={() => onCardAction('edit', card._id)}>  <i className="fa fa-edit"></i> Edit</button>
        <button onClick={() => onCardAction('delete', card._id)} ><i className="fa fa-trash"></i> Delete</button>
      </div>
      <h4>{card.title}</h4>
      <p>{card.description}</p>
    </div>
  );
};

const Dashboard = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [cards, setCards] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [isLoggedIn, setLoggedIn] = useState(true);

  const handleCardUpdate = async (cardId, updatedTitle, updatedDescription) => {
    try {
      await axios.put(`https://qurinom-a6vp.onrender.com/update-card/${cardId}`, {
        title: updatedTitle,
        description: updatedDescription,
      });

      fetchCards();
    } catch (error) {
      console.error(error);
    }

    setIsModalOpen(false);
  };


  useEffect(() => {
    
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      const response = await axios.get('https://qurinom-a6vp.onrender.com/cards');
      setCards(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateCard = async () => {
    if (!title || !description) {
     
      alert('Please fill in all fields.');
      return;
    }
  
    try {
      await axios.post('https://qurinom-a6vp.onrender.com/create-card', {
        title,
        description,
      });
  
    
      fetchCards();
      setTitle("");
      setDescription("");
    } catch (error) {
      console.error(error);
    }
  };
  const handleEditClick = (card) => {
    setSelectedCard(card);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (cardId) => {
   
    const isConfirmed = window.confirm('Are you sure you want to delete this card?');

    if (isConfirmed) {
      
      deleteCard(cardId);
    }
  };

  const deleteCard = async (cardId) => {
    try {
      await axios.delete(`https://qurinom-a6vp.onrender.com/delete-card/${cardId}`);
      fetchCards();
    } catch (error) {
      console.error(error);
    }
  };

  const moveCard = (fromIndex, toIndex) => {
    const updatedCards = [...cards];
    const [movedCard] = updatedCards.splice(fromIndex, 1);
    updatedCards.splice(toIndex, 0, movedCard);
    setCards(updatedCards);
  };

  const handleCardAction = (action, cardId) => {
    if (action === 'edit') {
      handleEditClick(cards.find((card) => card._id === cardId));
    } else if (action === 'delete') {
      handleDeleteClick(cardId);
    }
  };


  const handleLogout = () => {
    const isConfirmed = window.confirm('Are you sure you want to logout?');

    if (isConfirmed) {
      setLoggedIn(false);
      window.location.href = '/login';
    }
  };
  return (
    <DndProvider backend={HTML5Backend}>
    <div className='dashboard'>
      <video src={videoSource} autoPlay loop muted></video>
      <h2 className='topic'>Dashboard</h2>
      <div className='dashboardinputs'>
        <div>
          <label className='dashboardlabel'>Title:</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Type your title" className='cardinput' />
        </div>
        <div>
          <label className='dashboardlabel'>Description:</label>
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Type your descritption" className='cardinput' />
        </div>
        <div>
          <button onClick={handleCreateCard} className='buttoncreate'>
            <div className="buttoncreate-top">Create Card</div>
            <div className="buttoncreate-bottom"></div>
            <div className="buttoncreate-base"></div>
          </button>
        </div>
      </div>
      <div>
        <h3 className='topic'>Cards</h3>
        {cards.map((card, index) => (
          <DraggableCard key={card._id} card={card} index={index} 
          moveCard={moveCard} 
            onCardAction={handleCardAction}
           />
        ))}
      </div>
      {isModalOpen && (
        <div className="modal">
          <h3>Edit Card</h3>
          <label className='dashboardlabel'>Title</label>
          <input
            type="text"
            value={selectedCard.title}
            onChange={(e) => setSelectedCard({ ...selectedCard, title: e.target.value })}
            className='cardinput'
          />
          <label className='dashboardlabel'>Description</label>
          <input
            type="text"
            value={selectedCard.description}
            onChange={(e) => setSelectedCard({ ...selectedCard, description: e.target.value })}
            className='cardinput'
          />
          <button onClick={() => handleCardUpdate(selectedCard._id, selectedCard.title, selectedCard.description)} className='buttoncreate'>
            <div className="buttoncreate-top">Update</div>
            <div className="buttoncreate-bottom"></div>
            <div className="buttoncreate-base"></div>
          </button>

          <button onClick={() => setIsModalOpen(false)} className='cancel'>
            <a href="#" className='cancela'><span>Cancel</span></a>
          </button>
        </div>
      )}
       <div className='logout-container'>
          {isLoggedIn && (
            <button onClick={handleLogout} className='logout-button'>
              Logout
            </button>
          )}
        </div>
    </div>
    </DndProvider>
  );
};

export default Dashboard;


