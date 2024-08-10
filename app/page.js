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
    bgcolor="#F0F2F5"
    sx={{
    transition: 'all 0.3s ease-in-out',
  }}
  >

  <Box
      width="100%"
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      padding="20px"
      boxShadow="0px 4px 12px rgba(0, 0, 0, 0.1)"
      bgcolor="#0066CC"
      color="#FFFFFF"
      borderRadius="0 0 8px 8px"
      position="fixed"
      top="0"
      left="0"
>
        <Typography variant="h4" color="##FFFFFF">
          PantrySensei
        </Typography>
        <TextField
          variant="outlined"
          placeholder="Search Items"
          value={searchTerm}
          onChange={handleSearch}
          sx={{
            width: '300px',
            backgroundColor: '#FFFFFF',
            borderRadius: '8px',
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
          }}
          InputProps={{
            style: {
              padding: '10px',
              fontSize: '16px',
            },
          }}
        />
      </Box>

  <Modal open={open} onClose={handleClose}>
    <Box sx={style}>
      <Typography variant="h6" color="#333333">Add Item</Typography>
      <Stack width="100%" direction="row" spacing={2}>
        <TextField
          variant='outlined'
          fullWidth
          value={itemName}
          onChange={(e)=>{
          setItemName(e.target.value)
        }}
        sx={{
          backgroundColor: '#FFFFFF',
          borderRadius: '8px',
          border: '2px solid #0066CC'
        }}
        InputProps={{
          style: {
            padding: '10px',
            fontSize: '16px',
          },
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
         sx={{
          backgroundColor: '#0066CC',
          color: '#FFFFFF',
          borderRadius: '8px',
          padding: '10px 20px',
          boxShadow: 'white',
          '&:hover': {
            backgroundColor: '#FFFFFF',
          },
        }}
         >
         Add
         </Button>    
      </Stack>
    </Box>
  </Modal>

    <Box 
        border='1px solid #DDDDDD'
        width='800px'
        borderRadius="8px"
        boxShadow="0px 4px 12px rgba(0, 0, 0, 0.1)"
        overflow="hidden"
        bgcolor="#FFFFFF">
      
    <Box
      width="100%"
      height="100px"
      bgcolor="#0066CC"
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      paddingLeft="20px"
      paddingRight="20px"
      borderRadius="8px 8px 0 0"
      color="#FFFFFF"
     >
     <Typography variant={'h2'} color={'#FFFFFF'}>
      Inventory
     </Typography>
     <Button
      variant="contained"
      onClick={() => setOpen(true)}
      sx={{
        backgroundColor: '#005BB5',
        color: '#FFFFFF',
        borderRadius: '8px',
        padding: '10px 20px',
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
        '&:hover': {
          backgroundColor: '#004C99',
        },
      }}
     >
      Add New Item
     </Button>
    </Box>

      
      <Stack width="800px" height="300px" spacing={2} overflow={'auto'} bgcolor="#F0F2F5" padding="20px">
        {filteredInventory.map(({name, quantity}) => (
          <Box
            key={name}
            width="100%"
            minHeight="100px"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            bgcolor="#FFFFFF"
            padding="10px"
            borderRadius="8px"
            boxShadow="0px 4px 12px rgba(0, 0, 0, 0.05)"
            transition="transform 0.2s ease-in-out"
            sx={{
            '&:hover': {
              transform: 'scale(1.02)',
            },
          }}
          >
            <Typography variant={'h5'} color={'#333333'} textAlign={'center'}>
              {name.charAt(0).toUpperCase() + name.slice(1)}
            </Typography>

            <Typography variant={'h5'} color={'#333333'} textAlign={'center'}>
              Ct: {quantity}
            </Typography>

            <Stack direction="row" spacing={2}>

            <Button variant="contained" onClick={() => addItem(name)} sx={{
                    borderColor: '#0066CC',
                      color: '#FFFFFF',
                    '&:hover': {
                      borderColor: '#005BB5',
                    },
                  }}>
            Add
            </Button>
            <Button variant="contained" onClick={() => removeItem(name)} sx={{
                    borderColor: '#FF3333',
                    color: '#FFFFFF',
                    '&:hover': {
                      borderColor: '#CC0000'
                    },
                  }}>
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