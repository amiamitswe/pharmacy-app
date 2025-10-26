"use client"
import { Button, Input } from '@heroui/react'
import React from 'react'
import { CiCirclePlus } from "react-icons/ci";


function PageTopContent() {
  return (
    <div className='flex items-center justify-between mb-4'>
      <h1 className='text-xl'>Company 100</h1>
      <div className='flex items-center gap-4'>
        <Input placeholder='Search here ...' variant='bordered' />
        <Button color="success" variant='bordered' className='w-[200px]' startContent={<CiCirclePlus className='text-2xl' />}>
        Add new
      </Button>
      </div>
    </div>
  )
}

export default PageTopContent

// endContent={<CameraIcon />}