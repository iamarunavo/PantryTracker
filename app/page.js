"use client";
import Image from "next/image";
import { useState,useEffect } from "react";
import { Firestore, getFirestore } from "firebase/firestore";
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

import { firestore } from './firebase'; 

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: '#F5F5DC',
  border: '2px solid #654321',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
}

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(true)
  const [itemName, setItemName] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredInventory, setFilteredInventory] = useState([])


  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
        inventoryList.push({
            name: doc.id,
            ...doc.data(),
        })
    })
    setInventory(inventoryList)
    setFilteredInventory(inventoryList)
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
  const docSnap = await getDoc(docRef)
  if (docSnap.exists()) {
    const { quantity } = docSnap.data()
    if (quantity === 1) {
      await deleteDoc(docRef)
    } else {
      await setDoc(docRef, { quantity: quantity - 1 })
    }
  }
  await updateInventory()
  }

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      await setDoc(docRef, { quantity: quantity + 1 })
    } else {
      await setDoc(docRef, { quantity: 1 })
    }
    await updateInventory()
  }

const handleOpen = () => setOpen(true)
const handleClose = () => setOpen(false)

const handleSearch = (e) => {
  const searchTerm = e.target.value.toLowerCase()
  setSearchTerm(searchTerm)
  const filtered = inventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm)
  )
  setFilteredInventory(filtered)
}


  useEffect(() => {
    updateInventory()
  }, [])

  return (
  <Box 
    width="100vw"
    height="100vh" 
    display="flex" 
    justifyContent="center"
    flexDirection="column"
    alignItems="center"
    gap={2}
    bgcolor="#F5F5DC"
  >

<Box
        width="100%"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        padding="20px"
        boxShadow="0px 4px 12px rgba(0, 0, 0, 0.1)"
        bgcolor="#FFA500"
        border="2px solid #654321"
        position="fixed"
        top="0"
        left="0"
        

      >
        <Typography variant="h4" color="#654321">
          PantrySensei
        </Typography>
        <TextField
          variant="outlined"
          placeholder="Search Items"
          value={searchTerm}
          onChange={handleSearch}
          sx={{
            width: '300px',
            borderRadius: '8px',
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
          }}
        />
      </Box>

  <Modal open={open} onClose={handleClose}>
    <Box
      position="absolute" 
      top="50%" 
      left="50%"
      transform="translate(-50%,-50%)"
      width={400}
      bgcolor="#F5F5DC"
      border="2px solid #654321"
      boxShadow={24}
      p={4}
      display="flex"
      flexDirection="column"
      gap={3}
      sx={{
        transform: 'translate(-50%,-50%)'
      }}
    >
      <Typography variant="h6" color="#654321">Add Item</Typography>
      <Stack width="100%" direction="row" spacing={2}>
        <TextField
          variant='outlined'
          fullWidth
          value={itemName}
          onChange={(e)=>{
          setItemName(e.target.value)
        }}
        >
        </TextField>  
        <Button 
          variant="outlined" 
          onClick={()=>{
          addItem(itemName)
          setItemName('')
          handleClose()   
         }}
         sx={{ borderColor: '#6B8E23', color: '#6B8E23' }}
         >
         Add
         </Button>    
      </Stack>
    </Box>
  </Modal>

    <Box border='1px solid #FF7F50' width='800px'>
      
    <Box
      width="100%"
      height="100px"
      bgcolor="linear-gradient(45deg, #FF7F50, #FF6347)"
      display="flex"
      justifyContent="space-between"  // Distributes space between the text and button
      alignItems="center"  // Vertically centers both the text and button
      paddingLeft="20px"  // Adds padding to the left for the text
      paddingRight="20px"  // Adds padding to the right for the button
      borderRadius="8px 8px 0 0"
     >
     <Typography variant={'h2'} color={'#333'}>
      Inventory
     </Typography>
     <Button
      variant="contained"
      onClick={() => setOpen(true)}
      sx={{
      backgroundColor: '#6B8E23',
      color: '#FFF',
      borderRadius: '8px',
      padding: '10px 20px',
      boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    }}
     >
      Add New Item
     </Button>
    </Box>

      
      <Stack width="800px" height="300px" spacing={2} overflow={'auto'}>
        {filteredInventory.map(({name, quantity}) => (
          <Box
            key={name}
            width="100%"
            minHeight="150px"
            display={'flex'}
            justifyContent={'space-between'}
            alignItems={'center'}
            bgcolor={'#F5F5DC'}
            padding={5}
            border="1px solid #654321"
          >
            <Typography variant={'h3'} color={'#654321'} textAlign={'center'}>
              {name.charAt(0).toUpperCase() + name.slice(1)}
            </Typography>

            <Typography variant={'h3'} color={'#654321'} textAlign={'center'}>
              Ct: {quantity}
            </Typography>

            <Stack direction="row" spacing={2}>

            <Button variant="contained" onClick={() => addItem(name)} sx={{ borderColor: '#6B8E23', color: '#654321' }}>
            Add
            </Button>
            <Button variant="contained" onClick={() => removeItem(name)} sx={{ borderColor: '#6B8E23', color: '#654321' }}>
            Remove
            </Button>

            </Stack>
          </Box>
        ))}
      </Stack>
    </Box>
  </Box>
  )
}