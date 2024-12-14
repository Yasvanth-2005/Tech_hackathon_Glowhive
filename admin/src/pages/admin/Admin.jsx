import React, { useEffect,useState } from 'react'
import Layout from '../../components/layout/Layout'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import toast, { Toaster } from "react-hot-toast";
import axios from "axios"

const Admin = () => {
    const navigate = useNavigate()
    const user = useSelector((state) => state.auth.user)
    const [adminsData,setAdminsData] = useState([])
    const [loading,setLoading] = useState(false)
    const apiUrl = import.meta.env.VITE_API_URL; 
    const fetchAdmins = async () => {
      setLoading(true)
      try {
        const response = await axios.get(`${apiUrl}/admin/admins`,{
          headers:{
            Authorization: `Bearer ${user?.token}`,
          }
        })

        if (response.status == 200){
          setAdminsData(response.data)
        }
      } catch (error) {
        console.log("error while fetching admins data")
      }
    }

    useEffect(() => {
      fetchAdmins()
    },[])

    console.log(adminsData.admins)
  return (
    <Layout>
      <Toaster position="top-center" reverseOrder={false} />
        <div className="w-full flex itesm-center justify-between">
            <div className=""></div>
            <button className="mx-3 px-2 py-2 bg-purple-600 font-semibold rounded-md text-white" onClick={() => {
              navigate("/admin/create")
            }}>+Add</button>
        </div>
    </Layout>
  )
}

export default Admin
