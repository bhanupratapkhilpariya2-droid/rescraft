import toast from "react-hot-toast";
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { dummyResumeData } from '../assets/assets'
import { ArrowLeftIcon, Briefcase, ChevronLeft, ChevronRight, DownloadIcon, EyeIcon, EyeOffIcon, FileText, FolderIcon, GraduationCap, Share2Icon, Sparkles, User } from 'lucide-react'
import PersonallnFrom from '../components/PersonallnFrom'
import ResumePreview from '../components/ResumePreview'
import TemplateSelector from '../components/TemplateSelector'
import ColorPicker from '../components/ColorPicker'
import ProfessionalSummary from '../components/ProfessionalSummary'
import ExperienceForm from '../components/ExperienceForm'
import EducationForm from '../components/EducationForm'
import ProjectForm from '../components/ProjectForm'
import SkillsForm from '../components/SkillsForm'
import { useSelector } from 'react-redux'
import api from '../configs/api'

const ResumeBuilder = () => {
  const {resumeId}= useParams()
  const {token} = useSelector(state=>state.auth)
  const [resumedata , setresumedata]=useState({
    _id:'',
    title:'',
    personal_info:{},
    professional_summary:"",
    experience:[],
    education:[],
    project:[],
    skills:[],
    template:"classic",
    accent_color:"#3B82F6",
    public:false,
  }
)
const [activesectionindex ,setactivesectionindex ]= useState(0)
const [removebackground,setremovebackground ]=useState(false)



const changeResumeVisibility =async()=>{
  try {
    
    const formData = new FormData()
    formData.append('resumeId',resumeId)
   formData.append('resumeData', JSON.stringify({public:!resumedata.public}))

    const {data}=await api.put('/api/resume/update', formData,{headers:{
      Authorization: token }})
      setresumedata({...resumedata, public:!resumedata.public})
      toast.success(data.message)
  } catch (error) {
    console.error("Error saving resume:",error)
    
  }


}



const handleShare =()=>{
const frontedUrl = window.location.href.split('/app/')[0];
const resumeUrl = frontedUrl+'/view/'+resumeId;
if(navigator.share){
  navigator.share({url:resumeUrl,text:"My Resume",})
}else{
  alert('Share not supported on this browser. ')
}

}
const downloadResume =()=>{
  window.print();
}
const sections =[
  {id:"personal", name:"Personal Info", icon:User},
  {id:"summary", name:"Summary Info", icon:FileText},
  {id:"experience", name:"Experience", icon:Briefcase},
  {id:"education", name:"Education", icon:GraduationCap},
  {id:"projects", name:"Projects", icon:FolderIcon},
   {id:"skills", name:"Skills", icon:Sparkles},

]

const activesection =sections[activesectionindex]

const loadexistingresume = async ()=>{
  try {
    
    const {data}=await api.get('/api/resume/get/' + resumeId,{headers:{
      Authorization: token }})
      if(data.resume){
        setresumedata(data.resume)
        document.title = data.resume.title;
      } 
  } catch (error) {
    console.log(error.message)
  }

}

useEffect(()=>{

  loadexistingresume()
},[ ])

const saveResume =async()=>{
try {
  
  let updatedResumeData = structuredClone(resumedata)
  if(typeof resumedata.personal_info.image === 'object'){
    delete updatedResumeData.personal_info.image
  }

  const formData = new FormData();
  formData.append("resumeId",resumeId)
  formData.append("resumeData", JSON.stringify(updatedResumeData))
  removebackground && formData.append("removeBackground", "yes");
  typeof resumedata.personal_info.image === 'object' && formData.append("image", resumedata.personal_info.image)

  const {data} = await api.put('/api/resume/update', formData, {headers:{
    Authorization: token }})
    setresumedata(data.resume)
    toast.success(data.message)
} catch (error) {
  console.error("Error saving resume:", error)
}
}



  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Link to={'/app'} className='inline-flex gap-2 items-center text-slate-500
         hover:text-slate-700 transition-all'>
        <ArrowLeftIcon className='size-4'/>Back to Dashboard
        </Link>
      </div>

<div className='max-w-7xl mx-auto px-4 pb-8'>
  <div className='grid lg:grid-cols-12 gap-8'>
{/*Left panel - Form*/}

<div className='lg:col-span-5'>
  <div className=' relative lg:col-span-5 rounded-lg overflow-hidden '>
    <div className='bg-white shadow-sm rounded-lg border border-gray-200 p-6 pt-1'>
{/*progress bar using activsection index */}
<hr className='absolute top-0 left-0 right-0 border-2 border-gray-200'/>
<hr className=' absolute top-0 left-0 h-1 bg-gradient-to-r from-green-500 to-green-600 border-none 
transition-all duration-2000'style={{width:`${activesectionindex*100/(sections.length-1)}%`}}/>
    {/*section navigation*/}
    <div className='flex justify-between items-center mb-6 border-b border-gray-300 py-1'>


      <div className='flex items-center gap-2'
      ><TemplateSelector selectedTemplate={resumedata.template} onChange={(template)=>setresumedata(prev=>({...prev,template}))}/></div>

<ColorPicker selectedTemplate={resumedata.accent_color} onChange={(color)=>setresumedata(prev=>({...prev, accent_color:color}))}/>

      <div className='flex items-center'>
        {activesectionindex !==0 &&(
           <button onClick={()=>setactivesectionindex((previndex)=>Math.max(previndex-1,0 ))}
          className=' flex  items-center gap-1 p-3 rounded-lg text-sm font-medium
         text-gray-600 hover:bg-gray-50 transition-all ' disabled={activesectionindex === 0}>
          <ChevronLeft className='size-4' />Previous

        </button>)}
  <button onClick={()=>setactivesectionindex((previndex)=>Math.min(previndex + 1,sections.length -1 ))}
          className={`flex items-center gap-1 p-3 rounded-lg text-sm font-medium
           text-gray-600 hover:bg-gray-50 transition-all  ${activesectionindex === sections.length -1 && 'opacity-50'}`} disabled={activesectionindex === sections.length - 1}>
         Next <ChevronRight className='size-4' />

        </button>



      </div>

    </div>
    {/* form content */}
    <div className="space-y-6">
{activesection.id === 'personal' && (
 <PersonallnFrom data={resumedata.personal_info} onChange={(data)=>setresumedata (prev=>({...prev,personal_info:data }))}
  removebackground={removebackground}  setremovebackground={setremovebackground}/>
)}
{
  activesection.id ==='summary' &&(
    <ProfessionalSummary data={resumedata.professional_summary}
     onChange={(data)=>{setresumedata(prev=>({...prev,professional_summary: data}))}} setresumedata={setresumedata}/>
  )
}

{
  activesection.id ==='experience' &&(
    <ExperienceForm data={resumedata.experience}
     onChange={(data)=>{setresumedata(prev=>({...prev,experience: data}))}}/>
  )
}

{
  activesection.id ==='education' &&(
    <EducationForm data={resumedata.education}
     onChange={(data)=>{setresumedata(prev=>({...prev,education: data}))}}/>
  )
}

{
  activesection.id ==='projects' &&(
    <ProjectForm data={resumedata.project}
     onChange={(data)=>{setresumedata(prev=>({...prev,project: data}))}}/>
  )
}
{
  activesection.id ==='skills' &&(
    <SkillsForm data={resumedata.skills}
     onChange={(data)=>{setresumedata(prev=>({...prev,skills: data}))}}/>
  )
}


    </div>
    
    <button onClick={()=>{toast.promise(saveResume,{loading:'Saving...'})}} className='bg-gradient-to-br from-green-100 to-green-200 ring-green-300
    text-green-600 ring hover:ring-green-400 transition-all rounded-md px-6 py-2 mt-6 text-sm'>Save Changes</button>
    </div>
  </div>
</div>

{/*Right panel - Preview*/}

<div  className='lg:col-span-7 max-lg:mt-6'>

{/*buttons*/}
<div className='relative w-full '>

<div className='absolute bottom-3 left-0 right-0 flex items-center justify-end gap-2 '>

  {resumedata.public && (
    <button onClick={handleShare} className='flex items-center p-2 px-4 gap-2 text-xs
     bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 rounded-lg ring-blue-300 hover:ring  transition-colors'>
<Share2Icon className='size-4'/>
Share
    </button>
  )}
  <button onClick={changeResumeVisibility} className='flex items-center p-2 px-4 gap-2 text-xs bg-gradient-to-br from-purple-100 to-purple-200 text-purple-600
  ring-purple-300 rounded-lg hover:ring transition-color'>
    {resumedata.public ? <EyeIcon className='size-4'/>:
    <EyeOffIcon className='size-4'/>

    }
    {resumedata.public?'Public':'Private'}
  </button>
  <button onClick={downloadResume} className='flex items-center gap-2 px-6 py-2 text-xs bg-gradient-to-br from-green-100 to-green-200 text-green-600 rounded-lg
  ring-green-300 hove:ring transition-colors'>
    <DownloadIcon className='size-4'/>Download

  </button>
</div>


</div>
  
    
{/*resume preview */}
<div id="print-area">
  <ResumePreview
    data={resumedata}
    template={resumedata.template}
    accentColor={resumedata.accent_color}
  />
  
  </div>
</div>



  </div>


</div>




    </div>
  )
}

export default ResumeBuilder

