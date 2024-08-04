'use client';
import Image from "next/image";

import { useState, useEffect } from "react";
import { firestore } from "@/public/firebase";
import { Box, Stack, Typography, Button, Modal, TextField } from '@mui/material'
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore'
import axios from "axios";

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: '#333', // Darker background for modal
  border: '2px solid #555', // Subtle border color for modal
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
}

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [expirationDate, setExpirationDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [suggestedRecepies, setSuggestedRecepies] = useState([]);

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() });
    });
    setInventory(inventoryList);
    setFilteredInventory(inventoryList);
  }

  const getNames = (data) => {
    let str = "";
    for(let i = 0; i < data.length; i++){
      str += data[i]?.name + ",";
    }
    return str.slice(0, -1);
  }

  useEffect(() => {
    if(filteredInventory?.length > 0){
      const inputStr = getNames(filteredInventory);
      axios.get(`https://api.spoonacular.com/recipes/findByIngredients?ingredients=${inputStr}&apiKey=8d98b598dd7143b782dedd5836cdefc0`).then((res) => {
        setSuggestedRecepies(res?.data);
      });
    }
  }, [filteredInventory]);

  useEffect(() => {
    updateInventory();
  }, []);

  useEffect(() => {
    if (searchQuery === '') {
      setFilteredInventory(inventory);
    } else {
      setFilteredInventory(
        inventory.filter(item =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, inventory]);

  const addItem = async (item, quantity, expirationDate) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity: existingQuantity } = docSnap.data();
      await setDoc(docRef, { quantity: existingQuantity + quantity, expirationDate });
    } else {
      await setDoc(docRef, { quantity, expirationDate });
    }
    await updateInventory();
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    await deleteDoc(docRef);
    await updateInventory();
  }

  const handleOpen = () => {
    setEditMode(false);
    setOpen(true);
  }

  const handleClose = () => setOpen(false);

  const handleEdit = (item) => {
    setEditMode(true);
    setCurrentItem(item);
    setItemName(item.name);
    setQuantity(item.quantity);
    setExpirationDate(item.expirationDate);
    setOpen(true);
  }

  const handleUpdate = async () => {
    if (currentItem) {
      const docRef = doc(collection(firestore, 'inventory'), currentItem.name);
      await setDoc(docRef, { quantity, expirationDate });
      await updateInventory();
      setOpen(false);
    }
  }

  return (
    <Box
      width="100vw"
      height="150vh"
      display='flex'
      justifyContent='center'
      flexDirection='column'
      alignItems='center'
      gap={3}
      bgcolor='#121212' // Dark background for the entire page
      sx={{ overflowY: 'scroll' }} // Ensure smooth scrolling
    >
      <Box
        display='flex'
        flexDirection='row'
        justifyContent='space-between'
        width='80%'
        padding='24px'
        bgcolor='#1e1e1e' // Darker background for the container
        borderRadius='12px'
        boxShadow='0 6px 12px rgba(0, 0, 0, 0.4)' // Softer shadow for a professional look
      >
        <Box
          display='flex'
          flexDirection='column'
          width='48%' // Reduced width for better spacing
        >
          <Typography variant="h5" color='#e0e0e0' marginBottom='16px'>
            Add Pantry Item
          </Typography>
          <TextField
            id="item-name"
            label="Name"
            variant="outlined"
            fullWidth
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            sx={{ 
              marginBottom: '16px',
              '& .MuiInputBase-input': { color: '#e0e0e0' }, 
              '& .MuiOutlinedInput-root': { bgcolor: '#333', borderColor: '#555' },
              '& .MuiInputLabel-root': { color: '#e0e0e0' }, 
              '& .MuiFormHelperText-root': { color: '#e0e0e0' }, 
            }}
          />
          <TextField
            id="quantity"
            label="Quantity"
            type="number"
            variant="outlined"
            fullWidth
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            sx={{ 
              marginBottom: '16px',
              '& .MuiInputBase-input': { color: '#e0e0e0' },
              '& .MuiOutlinedInput-root': { bgcolor: '#333', borderColor: '#555' },
              '& .MuiInputLabel-root': { color: '#e0e0e0' },
              '& .MuiFormHelperText-root': { color: '#e0e0e0' },
            }}
          />
          <TextField
            id="expiration-date"
            label="Expiration Date"
            type="date"
            variant="outlined"
            fullWidth
            value={expirationDate}
            onChange={(e) => setExpirationDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ 
              marginBottom: '16px',
              '& .MuiInputBase-input': { color: '#e0e0e0' },
              '& .MuiOutlinedInput-root': { bgcolor: '#333', borderColor: '#555' },
              '& .MuiInputLabel-root': { color: '#e0e0e0' },
              '& .MuiFormHelperText-root': { color: '#e0e0e0' },
            }}
          />
          <Button
            variant="contained"
            onClick={() => {
              if (editMode) {
                handleUpdate();
              } else {
                addItem(itemName, quantity, expirationDate);
                setItemName('');
                setQuantity(1);
                setExpirationDate('');
                handleClose();
              }
            }}
            sx={{ 
              bgcolor: '#009688', 
              color: '#ffffff', 
              '&:hover': { bgcolor: '#00796b' }, 
              borderRadius: '8px',
              padding: '10px 20px',
            }}
          >
            {editMode ? 'Update Item' : 'Add Item'}
          </Button>
        </Box>
        <Box
          display='flex'
          flexDirection='column'
          width='48%'
        >
          <Typography variant="h5" color='#e0e0e0' marginBottom='16px'>
            Pantry Items
          </Typography>
          <TextField
            id="search"
            label="Search items"
            variant="outlined"
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ 
              marginBottom: '16px',
              '& .MuiInputBase-input': { color: '#e0e0e0' },
              '& .MuiOutlinedInput-root': { bgcolor: '#333', borderColor: '#555' },
              '& .MuiInputLabel-root': { color: '#e0e0e0' },
              '& .MuiFormHelperText-root': { color: '#e0e0e0' },
            }}
          />
          <Box
            display='flex'
            flexDirection='column'
            gap='8px'
            maxHeight='800px'
            overflow='auto'
            sx={{ 
              '&::-webkit-scrollbar': { width: '8px' }, 
              '&::-webkit-scrollbar-thumb': { background: '#555', borderRadius: '4px' }, 
              '&::-webkit-scrollbar-track': { background: '#333' }
            }}
          >
            {filteredInventory.map((item, index) => (
              <Box
                key={index}
                display='flex'
                justifyContent='space-between'
                alignItems='center'
                padding='12px'
                bgcolor='#222' // Darker background for list items
                borderRadius='8px'
                boxShadow='0 2px 4px rgba(0, 0, 0, 0.2)' // Subtle shadow for list items
              >
                <Box display='flex' flexDirection='column'>
                  <Typography color='#e0e0e0'>{item.name}</Typography>
                  <Typography color='#aaaaaa' fontSize='14px'>Quantity: {item.quantity}</Typography>
                  <Typography color='#aaaaaa' fontSize='14px'>Expires: {item.expirationDate}</Typography>
                </Box>
                <Box display='flex' gap='8px'>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleEdit(item)}
                    sx={{ 
                      borderColor: '#009688',
                      color: '#009688',
                      '&:hover': { borderColor: '#00796b', color: '#00796b' },
                      borderRadius: '8px', 
                      padding: '6px 12px', 
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => removeItem(item.name)}
                    sx={{ 
                      borderColor: '#f44336',
                      color: '#f44336',
                      '&:hover': { borderColor: '#d32f2f', color: '#d32f2f' },
                      borderRadius: '8px', 
                      padding: '6px 12px', 
                    }}
                  >
                    Remove
                  </Button>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      <Box
        width='80%'
        padding='24px'
        bgcolor='#1e1e1e'
        borderRadius='12px'
        boxShadow='0 6px 12px rgba(0, 0, 0, 0.4)'
        marginTop='16px'
      >
        <Typography variant="h5" color='#e0e0e0' marginBottom='16px'>
          Recipe Suggestions
        </Typography>
        <Box
          display='flex'
          flexDirection='column'
          gap='8px'
          maxHeight='400px'
          overflow='auto'
          sx={{ 
            '&::-webkit-scrollbar': { width: '8px' }, 
            '&::-webkit-scrollbar-thumb': { background: '#555', borderRadius: '4px' }, 
            '&::-webkit-scrollbar-track': { background: '#333' }
          }}
        >
          {suggestedRecepies.map((recipe, index) => (
            <Box
              key={index}
              display='flex'
              flexDirection='column'
              padding='12px'
              bgcolor='#222'
              borderRadius='8px'
              boxShadow='0 2px 4px rgba(0, 0, 0, 0.2)'
              marginBottom='8px'
            >
              <Typography color='#e0e0e0'>{recipe.title}</Typography>
              <Box display='flex' flexDirection='row' alignItems='center'>
                <Image src={recipe.image} alt={recipe.title} width={100} height={100} />
                <Box display='flex' flexDirection='column' marginLeft='16px'>
                  <Typography color='#aaaaaa' fontSize='14px'>Used ingredients: {recipe.usedIngredientCount}</Typography>
                  <Typography color='#aaaaaa' fontSize='14px'>Missed ingredients: {recipe.missedIngredientCount}</Typography>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      <Modal
        open={open}
        onClose={handleClose}
      >
        <Box sx={modalStyle}>
          <Typography variant="h6" color='#e0e0e0'>
            {editMode ? 'Edit Item' : 'Add New Item'}
          </Typography>
          <TextField
            id="modal-item-name"
            label="Name"
            variant="outlined"
            fullWidth
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            sx={{ 
              marginBottom: '16px',
              '& .MuiInputBase-input': { color: '#e0e0e0' },
              '& .MuiOutlinedInput-root': { bgcolor: '#333', borderColor: '#555' },
              '& .MuiInputLabel-root': { color: '#e0e0e0' },
              '& .MuiFormHelperText-root': { color: '#e0e0e0' },
            }}
          />
          <TextField
            id="modal-quantity"
            label="Quantity"
            type="number"
            variant="outlined"
            fullWidth
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            sx={{ 
              marginBottom: '16px',
              '& .MuiInputBase-input': { color: '#e0e0e0' },
              '& .MuiOutlinedInput-root': { bgcolor: '#333', borderColor: '#555' },
              '& .MuiInputLabel-root': { color: '#e0e0e0' },
              '& .MuiFormHelperText-root': { color: '#e0e0e0' },
            }}
          />
          <TextField
            id="modal-expiration-date"
            label="Expiration Date"
            type="date"
            variant="outlined"
            fullWidth
            value={expirationDate}
            onChange={(e) => setExpirationDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ 
              marginBottom: '16px',
              '& .MuiInputBase-input': { color: '#e0e0e0' },
              '& .MuiOutlinedInput-root': { bgcolor: '#333', borderColor: '#555' },
              '& .MuiInputLabel-root': { color: '#e0e0e0' },
              '& .MuiFormHelperText-root': { color: '#e0e0e0' },
            }}
          />
          <Button
            variant="contained"
            onClick={() => {
              if (editMode) {
                handleUpdate();
              } else {
                addItem(itemName, quantity, expirationDate);
                setItemName('');
                setQuantity(1);
                setExpirationDate('');
                handleClose();
              }
            }}
            sx={{ 
              bgcolor: '#009688',
              color: '#ffffff',
              '&:hover': { bgcolor: '#00796b' },
              borderRadius: '8px',
              padding: '10px 20px',
            }}
          >
            {editMode ? 'Update Item' : 'Add Item'}
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}
