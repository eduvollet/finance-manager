"use client";

import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { TransactionType } from '@/lib/types';
import { CreateCategorySchema, CreateCategorySchemaType } from '@/schema/categories';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusSquare } from 'lucide-react';
import React from 'react'
import { useForm } from 'react-hook-form';

interface Props{
    type: TransactionType;
}

function CreateCategoryDialog({type}: Props) {
    const [open, setOpen] = React.useState(false);
    const form = useForm<CreateCategorySchemaType>({
        resolver: zodResolver(CreateCategorySchema),
        defaultValues: {
            type,
        }
    });


  return (
    <Dialog open={open} onOpenChange={setOpen}>
    <DialogTrigger asChild>
        <Button variant={"ghost"} className='flex 
        boarder-separate items-center justify-start 
        roundned-none border-b px-3 py-3 
        text-muted-foreground'>
            <PlusSquare className='mr-2 h-4 w-4'/>
            Criar nova categoria
        </Button>
    </DialogTrigger>
    </Dialog>
  )
}

export default CreateCategoryDialog