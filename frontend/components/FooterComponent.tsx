import { FaEnvelope } from 'react-icons/fa'
import { IoCall } from 'react-icons/io5'
import { PiLineVerticalLight } from 'react-icons/pi'

const FooterComponent = () => {
  return (
    <div>
     
      {/* for large screen */}
      <div className='h-20 bg-[#00293C] w-full lg:flex justify-center items-center space-x-4 hidden z-10'>
      <div className='w-64 h-4'></div>
        <div className='flex justify-center items-center gap-2'>
          <FaEnvelope className='text-white' />
          <p className='text-white text-sm'>info@amplifyresearch.com</p>
        </div>
        <PiLineVerticalLight className='text-white' />
        <div className='flex justify-center items-center gap-2'>
          <IoCall className='text-white' />
          <p className='text-white text-sm'>925 236 9700</p>
        </div>
        <PiLineVerticalLight className='text-white' />
        <p className='text-white text-sm'>Terms & Conditions</p>
        <PiLineVerticalLight className='text-white' />
        <p className='text-white text-sm'>Privacy Policy</p>
      </div>
      {/* for small screen */}
      <div className=' bg-[#00293C] w-full  lg:hidden py-5'>
      <div className='w-64 h-4'></div>
        <div className='flex justify-center items-center gap-2'>
          <FaEnvelope className='text-white text-xs' />
          <p className='text-white text-xs'>info@amplifyresearch.com</p>
        </div>
        <div className='flex justify-center items-center space-x-2 pt-3'>
          <div className='flex justify-center items-center gap-2 '>
            <IoCall className='text-white text-xs' />
            <p className='text-white text-xs'>925 236 9700</p>
          </div>
          <PiLineVerticalLight className='text-white' />
          <p className='text-white text-xs'>Terms & Conditions</p>
          <PiLineVerticalLight className='text-white' />
          <p className='text-white text-xs'>Privacy Policy</p>
        </div>
      </div>
    </div>
  )
}

export default FooterComponent
