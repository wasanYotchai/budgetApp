"use client"; 

import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerClose } from './ui/drawer';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"; // Correct import for zodResolver
import { accountSchema } from '@/app/lib/schema';
import { Input } from './ui/input'; // Use named import if Input is a named export
import { Select, SelectTrigger, SelectValue, SelectItem, SelectContent } from './ui/select'; // Ensure SelectContent is imported
import { Switch } from './ui/switch';
import { Button } from './ui/button'; // Ensure Button is imported
import useFetch from '@/hooks/use-fetch';
import { createAccount } from '@/actions/dashboard';
import { Loader2 } from 'lucide-react';
import { toast } from "sonner";

const CreateAccountDrawer = ({ children }) => {
  const [open, setOpen] = useState(false); // Initialize state for drawer open/close

  const { 
    register, 
    handleSubmit,
    formState: { errors },
    reset, 
    setValue, // Added to set the value of the select
    watch, // Added to watch the value of the select
  } = useForm({
    resolver: zodResolver(accountSchema), // Ensure this is correctly imported
    defaultValues: {
      name: "", 
      type: "CURRENT", 
      balance: "", 
      isDefault: false,
    }, 
  }); 

  const {
    data: newAccount, 
    error, 
    fn: createAccountFn, 
    loading: createAccountLoading,
  } = useFetch(createAccount);

  // Handle success when a new account is created
  useEffect(() => {
    if (newAccount && !createAccountLoading) {
      toast.success("Account created successfully");
      reset(); // Reset the form
      setOpen(false); // Close the drawer
    }
  }, [newAccount, createAccountLoading, reset]);

  // Handle errors during account creation
  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to create account");
    }
  }, [error]);

  const onSubmit = async (data) => {
    await createAccountFn(data); // Call the create account function
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Create New Account</DrawerTitle>
        </DrawerHeader>

        <div className='px-4 pb-4'>
          <form className='space-y-4' onSubmit={handleSubmit(onSubmit)}>
            <div className='space-y-2'>
              <label htmlFor="name" className='text-sm font-medium'>
                Account Name
              </label>
              <Input 
                id="name" 
                placeholder="e.g., Main Checking" 
                {...register("name")} 
              />
              {errors.name && (
                <p className='text-sm text-red-500'>{errors.name.message}</p>
              )}
            </div>

            <div className='space-y-2'>
              <label htmlFor="type" className='text-sm font-medium'>
                Account Type
              </label>

              <Select 
                onValueChange={(value) => setValue("type", value)} // Set the value of the select
                defaultValue={watch("type")} // Watch the value of the select
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CURRENT">Current</SelectItem>
                  <SelectItem value="SAVINGS">Savings</SelectItem>
                </SelectContent>
              </Select>

              {errors.type && (
                <p className='text-sm text-red-500'>{errors.type.message}</p>
              )}
            </div>

            <div className='space-y-2'>
              <label htmlFor="balance" className='text-sm font-medium'>
                Initial Balance
              </label>
              <Input 
                id="balance" 
                type="number"
                step="0.01"
                placeholder="0.00" 
                {...register("balance")} 
              />
              {errors.balance && (
                <p className='text-sm text-red-500'>{errors.balance.message}</p>
              )}
            </div>

            <div className='flex items-center justify-between rounded-lg border p-3'>
              <div className='space-y-0.5'>
                <label htmlFor="isDefault" className='text-sm font-medium cursor-pointer'>
                  Set as Default
                </label>
                <p className='text-sm text-muted-foreground'>
                  This account will be selected by default for transactions.
                </p>
              </div>
              <Switch 
                id='isDefault'
                onCheckedChange={(checked) => setValue("isDefault", checked)}
                checked={watch("isDefault")}       
              />
            </div>

            <div className='flex space-x-2'>
              <DrawerClose asChild>
                <Button type="button" variant="outline" className='flex-1'>
                  Cancel
                </Button>
              </DrawerClose>

              <Button 
                type="submit" 
                className="flex-1"
                disabled={createAccountLoading}>
                {createAccountLoading ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Creating...
                  </>
                ) : ( 
                  "Create Account"
                )}
              </Button>
            </div>
            
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default CreateAccountDrawer;
