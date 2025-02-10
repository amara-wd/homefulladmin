import React from 'react'

// const abc = {
//     name: "welcome",
//     age: 234,
//     height: 13212
// }

// const {name, age} = abc

// console.log(name)

interface ButtonProps{
    children: React.ReactNode,
    whenYouClick: () => void;
}

export default function Button({children, whenYouClick}: ButtonProps) {
  return (
    <div onClick={whenYouClick} style={{background: 'red', borderRadius: "10px", padding: "30px 60px"}}>
        {children}
    </div>
  )
}
