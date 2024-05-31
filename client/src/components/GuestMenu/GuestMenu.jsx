import { BsFingerprint } from 'react-icons/bs'
import { GrUserAdmin } from 'react-icons/gr'
import MenuItem from '../MenuItem/MenuItem'
import useRole from '../../hooks/useRole'
import HostModal from '../Categories/Modal/HostRequestModal'
import { useState } from 'react'
import useAxiosSecure from '../../hooks/useAxiosSecure'
import toast from 'react-hot-toast'
import useAuth from '../../hooks/useAuth'

const GuestMenu = () => {
  const [role] = useRole()
  const { user, logOut } = useAuth()

  const [isOpen, setIsOpen] = useState(false);
  const axiosSecure = useAxiosSecure()

  // for modal
  const [isModalOpen, setIsModalOpen] = useState(true);
  const closeModal = () => {
    setIsModalOpen(true)
  }

  const modalHandler = async () => {
    closeModal()
    try {
      const currentUser = {
        email: user?.email,
        role: 'guest',
        status: "Requested"
      }
      const { data } = await axiosSecure.put(`/user`, currentUser)
      console.log(data)
      if (data.modifiedCount > 0) {
        toast.success("Success! Please wait for admin approval!")
      }
      else {
        toast.success("Already requset sent! Please wait for admin approval!")
      }
    }
    catch (err) {
      console.log(err)
      toast.error(err.message)
    }
    finally {
      closeModal()
    }
  }
  console.log(role)
  return (
    <>
      <MenuItem
        icon={BsFingerprint}
        label='My Bookings'
        address='my-bookings'
      />

      {
        role === 'guest' && <div onClick={() => setIsModalOpen(false)} className='flex items-center px-4 py-2 mt-5  transition-colors duration-300 transform text-gray-600  hover:bg-gray-300   hover:text-gray-700 cursor-pointer'>
          <GrUserAdmin className='w-5 h-5' />

          <span className='mx-4 font-medium'>Become A Host</span>
        </div>
      }


      {/* modal  */}
      <HostModal isOpen={!isModalOpen} closeModal={closeModal} modalHandler={modalHandler}></HostModal>
    </>
  )
}

export default GuestMenu