
import React from 'react'

const Model = ({isOpen, onClose, Children}) => {
    if (!isOpen) return null;
    return (
        <div className='flex fixed top-0 left-0 w-[100%] h-[100%] bg-black bg-opacity-30 justify-center items-center z-[1000]'>
            <div className='bg-white p-[20px] rounded-md max-w-[500px] w-[100%] shadow-lg'>
                <button className='absolute top-[10px] right-[10px] cursor-pointer text-black'>
                        X
                </button>
                {Children}

            </div>

        </div>
    
  )
}

export default Model
