import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { dummyResumeData } from '../assets/assets'
import Loader from '../components/Loader'
import { ArrowLeftIcon } from 'lucide-react'
import ResumePreview from '../components/ResumePreview'
import api from '../configs/api'

const Preview = () => {
const {resumeId} =useParams()
const [isLoading ,setisLoading]=useState(true)
const [resumedata,setresumedata]= useState(null)
const loadResume = async() => {
  try {
    console.log('Loading resume ID:', resumeId);
    const {data} = await api.get('/api/resume/public/' + resumeId)
    console.log('Resume loaded:', data);
    setresumedata(data.resume)
  } catch (error) {
    console.log('Error details:', error.response?.data || error.message);
  }
  finally {
    setisLoading(false)
  }
}

useEffect(()=>{
  loadResume()
},[])
  return resumedata ?(
    <div className='bg-slate-100'>
      <div className='max-w-3xl mx-auto py-10'>

<ResumePreview
    data={resumedata}
    template={resumedata.template}
    accentColor={resumedata.accent_color}
    className="py-4 bg-white"
  />
      </div>
      
    </div>
  ):(
<div>
{isLoading?<Loader/>:(
  <div className='flex flex-col items-center justify-center h-screen'>
    <p className='text-center text-6xl text-slate-400 font-medium'>Resume not found</p>
    <a href='/' className='mt-6 bg-purple-500 hover:bg-purple-600 text-white
    rounded-full px-6 h-9 m-1 ring-offset-1 ring-1 ring-purple-400
    flex items-center transition-colors'>
      <ArrowLeftIcon className='mr-2 size-4'/>
      go to home page
    </a>
  </div>
)
}
</div>
  )
}

export default Preview
