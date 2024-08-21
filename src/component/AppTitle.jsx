import React from 'react'

function AppTitle({setMenu}) {
    return (
      <>
        <div className="flex justify-between w-full pb-5">
          <img
            className="w-[30px] sm:w-[50px]"
            src="/codelogo.png"
            alt="logo"
          />
          <div className="flex flex-col items-end">
            <h1 className="text-lg sm:text-xl font-bold my-auto text-orange-400">
              Code-बैठक
            </h1>
            <p className="text-[8px] sm:text-[10px] tracking-tight sm:max-w-[200px] text-right text-wrap">
              Online Coding Collaboration Platform
            </p>
          </div>
        </div>
      </>
    );
}

export default AppTitle