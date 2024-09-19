'use client'
import {Button, Form,Input, message } from "antd";
import React from 'react';
import Link from 'next/link';
import { gentAntdFieldRrequiredRule } from "@/helpers/validation";
import axios from "axios";
import { useRouter } from "next/navigation";


interface userType{
  name:String;
  email:String;
  password:String;
}


function Register() {
  const router = useRouter();
  const [loading, setloading] = React.useState(false)
  const onRegister = async (values:userType) => {
    try{
      setloading(true)
      await axios.post("/api/auth/register", values)
      message.success("Registeration  successful, please Login to continue");
      router.push("/auth/login");
    }
    catch(error: any){
      message.error(error.response.data.message);
    }finally {
      setloading(false)
    }
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
      <div className="h-full bg-primary hidden md:flex items-center justify-center">
        <h1 className="text-7xl font-bold text-red-500">TREVA</h1>
        <h1 className="text-7xl font-bold text-gray-500">-</h1>
        <h1 className="text-7xl font-bold text-blue-500">TRENDS</h1>
      </div>
      <div className="flex items-center justify-center h-full">
      <Form className="w-[400px] flex flex-col gap-5"
      layout = "vertical" 
      onFinish={onRegister}>


        <h1 className="text-2xl font-bold">Register</h1>
        <hr />
        <Form.Item name = "name" label="Name"
        rules={gentAntdFieldRrequiredRule("Please input your name!")}> 
          <Input type="text" />
        </Form.Item>
        <Form.Item name = "email" label="Email"
        rules={gentAntdFieldRrequiredRule("Please input your email!")}> 
          <Input type="email" />
        </Form.Item>
        <Form.Item name = "password" label="Password"
        rules={gentAntdFieldRrequiredRule("Please input your password!")}> 
          <Input type="password" />
        </Form.Item>
        <Button type="primary" htmlType="submit" block
        loading = {loading}>
          Register
        </Button>
        <Link href="/auth/login" className="text-primary">
        Already have an account? Login
        </Link>
      </Form>
      </div>
    </div>
  )
}

export default Register; 