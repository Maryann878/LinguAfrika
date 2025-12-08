import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import logo from "/logo.png"
import frame from "/frame.png"
import iconV from "/IconV.png"

export default function SplashScreen() {
  const [hide, setHide] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => {
      setHide(true)
      navigate("/welcome-onboarding")
    }, 3000)

    return () => clearTimeout(timer)
  }, [navigate])

  if (hide) return null

  return (
    <div className="fixed top-0 left-0 w-screen h-screen bg-gray-300 bg-cover bg-center bg-no-repeat bg-fixed flex justify-center items-center font-sans">
      <div className="flex justify-center items-center w-full h-full relative">
        <div className="relative w-[550px] h-[550px]">
          <img src={frame} alt="Frame" className="w-full h-full object-contain block relative top-[115px] z-[1]" />
          <div className="absolute top-[47.5%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[45%] h-[45%] z-[2]">
            <img src={logo} alt="Logo" className="w-full h-full object-contain" />
          </div>
          <img src={iconV} alt="Icon" className="absolute top-[70.5px] left-[360px] w-[109px] h-[109px] z-[3]" />
        </div>
      </div>
      <div className="absolute bottom-5 w-full text-center text-sm text-gray-500 font-sans">
        Sponsored by <span className="text-black font-bold">Tecvinson</span>
      </div>
    </div>
  )
}

