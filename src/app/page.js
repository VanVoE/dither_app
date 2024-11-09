"use client"

import { useEffect, useRef, useState } from "react";
import { ditherImage } from "../../utils/functions";

// add drop down
// add customizable param

// add a way to donwload image
// clean up code
// clean up ui

export default function Home() {
  const canvasRef = useRef(null);
  const [clicked,setClicked] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [image, setImage] = useState(null);
  const [loaded, setLoaded] = useState(false)
  const [algoText, setAlgoText] = useState("Select Dither Algo")
  const [colorArray, setColorArray] = useState([0,85,170,255])
  
  
{/*
0: floydSteinberg default value
1: jjnDithering
2: stuckiDithering
3: atkinsonDithering
4: burkesDithering
*/}

const [selectedAlgo, setSelectedAlgo] = useState('0')

  const loadImage = (e) => {
    const file = e.target.files[0];
    if (file){
      
      setImage(URL.createObjectURL(file))
      setSelectedFile(file)

      

    }
    
 
  };

  const generateDither = () => {

     if (selectedFile) {
      const img = new Image();
      const reader = new FileReader();
      
      reader.onload = (event) => {
        img.onload = () => {
          const ctx = canvasRef.current.getContext('2d');
         
          ctx.drawImage(img, 0,0,500, 500);
          ditherImage(canvasRef,selectedAlgo,colorArray);
          
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(selectedFile);
      setLoaded(true)
    }
    
  }

  const removeSelection = () => {
    setSelectedFile(null)
    setImage(null)
    setLoaded(false)
  }

  const setAlgo = (algo) => {
    let text, ditherAlgo

  
    switch (algo) {
      case '0':
        text = "Floyd Steinberg"
        ditherAlgo = "0"
        break;
      case '1':
        text = "Jarvis, Judice, and Ninke"
        ditherAlgo = "1"
        break;
      case '2':
        text = "Stucki"
        ditherAlgo = "2"
        break;
      case '3':
        text = "Atkinson"
        ditherAlgo = "3"
        break;
      case '4':
        text = "Burkes"
        ditherAlgo = "4"
      default:
        break;
    }
    
    setSelectedAlgo(ditherAlgo)
    setAlgoText(text)
    setClicked(false)
  }

  const changeColorArray = (e,index) => {
    const value = e.target.value
    const arr = [...colorArray]
    if(value > 255){
      arr[index] = 255
    } else if (value < 0){
      arr[index] = 0
    } else {
      arr[index] = e.target.value
    }
    
    setColorArray(arr)
  }

  const downloadImage = () => {
    
    let canvas = document.getElementById("myCanvas")
    let dataURL = canvas.toDataURL("image/png")

    let a = document.createElement('a')
    a.href = dataURL

    a.download = "dither-download.png"
    a.click()

  }

  

   return (
    <div className="max-w-6xl mx-auto pb-40">

      <nav className="flex mb-10 pt-4">
        
        <div className="text-lg uppercase">Dither Project</div>

       

      </nav>
     
      <div className="w-[100%] md:w-[80%] mx-auto mt-20">
     <div className="grid grid-cols-1 md:grid-cols-6">

       {/* col 1 */}
      <div className="col-span-1 md:col-span-2 ">
        { image ? (
          
            <img src={image} className="w-[250px] h-[250px] mb-6" />
         
          
        ) : 
        <label>
        <div className="flex flex-col items-center justify-center border border-dashed w-[250px] h-[250px]">
          <div className="flex flex-col justify-center items-center">
            
            
            
              
            
            <p className="text-lg">Click to upload</p>
           
          </div>

          
        </div>
        <input type="file" accept="image/*" onChange={loadImage} className="w-0 h-0" required/>
      </label>


        }
        <div className="space-y-6">

          {/* Drop Down */}
          <div className="relative">
              <div onClick={()=>setClicked(!clicked)} className=" mb-4 flex cursor-pointer mt-10">{algoText} 
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 ml-2 mt-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 5.25 7.5 7.5 7.5-7.5m-15 6 7.5 7.5 7.5-7.5" />
              </svg>
          </div>
              <div className={clicked ? "flex flex-col space-y-3 pt-2 pb-4 absolute left-0 right-0 bg-black border-gradient cursor-pointer" : "hidden"}>
                <div onClick={()=>setAlgo('0')}>Floyd Steinberg</div>
                <div onClick={()=>setAlgo('1')}>Jarvis, Judice, and Ninke</div>
                <div onClick={()=>setAlgo('2')}>Stucki</div>
                <div onClick={()=>setAlgo('3')}>Atkinson</div>
                <div onClick={()=>setAlgo('4')}>Burkes</div>
              </div>
              
            </div>
        <div className="mb-4">Change Values &#40;0 - 255&#41;:</div>
               <div className="grid grid-cols-2 gap-y-4">
               
                <input type="number" value={colorArray[0]} onChange={(e)=>changeColorArray(e,0)} className="bg-transparent w-20 border-b"/>
                <input type="number" value={colorArray[1]} onChange={(e)=>changeColorArray(e,1)} className="bg-transparent w-20 border-b"/>
                <input type="number" value={colorArray[2]} onChange={(e)=>changeColorArray(e,2)} className="bg-transparent w-20 border-b"/>
                <input type="number" value={colorArray[3]} onChange={(e)=>changeColorArray(e,3)} className="bg-transparent w-20 border-b"/>
              </div>
          

            <div className="flex flex-col pt-10 space-y-4">
              <button className="py-2 px-10 rounded-sm border text-center hover:border-[#3acfd5]" onClick={removeSelection}>Remove Selection</button>
              <button onClick={generateDither} className="py-2 px-10 rounded-sm  border-transparent hover:border-2 hover:border-[#3acfd5] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" >Submit</button>
            </div>
          
        </div>
      
      
      </div>
      
      
      {/* col 2 */}
      <div className="flex flex-col space-y-4 col-span-1 md:col-span-4 items-center ">
       
        <div>
         {loaded? 
         <div>
          <canvas id="myCanvas" ref={canvasRef} width={500} height={500} className="border-gradient"/>
            <button onClick={downloadImage} className="w-full mt-4 py-2 px-10 rounded-sm border text-center hover:border-[#3acfd5]">Download</button>
          </div>
          :
          <div className=" w-[500px] h-[500px] text-center flex items-center border-gradient">
            <h1 className="w-full">Create Beautiful Dither Effects</h1>
          </div>
        }
          
          
        </div>
        
        
      </div>

      

      </div> 
      {/* End Grid */}
      </div>
      
      
      
      </div>
   )
   
}
