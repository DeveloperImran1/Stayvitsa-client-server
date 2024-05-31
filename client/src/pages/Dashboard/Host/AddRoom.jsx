import { useState } from "react";
import AddRoomForm from "../../../components/Forms/AddForm";
import useAuth from "../../../hooks/useAuth";
import { imageUpload } from "../../../api/utils";
import { Helmet } from 'react-helmet-async'
import { useMutation } from '@tanstack/react-query'
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const AddRoom = () => {
    const { user } = useAuth();
    const [imagePreview, setImagePreview] = useState();
    const [imageText, setImageText] = useState('')
    const [loading, setLoading] = useState(false)
    const axiosSecure = useAxiosSecure()
    const navigate = useNavigate()

    const [dates, setDates] = useState({
        startDate: new Date(),
        eneDate: null,
        key: "selection"
    })

    const handleDates = item => {
        console.log(item);
        setDates(item.selection)
    }

    // data post korbo DB te
    const { mutateAsync } = useMutation({
        mutationFn: async roomData => {
            const { data } = await axiosSecure.post('/room', roomData)
            return data;
        },
        onSuccess: () => {
            console.log('post hoisa')
            setLoading(false)
            toast.success("Post succefully added")
            navigate('/dashboard/my-listings')
        }
    })

    const handleSubmit = async e => {
        setLoading(true)
        e.preventDefault()
        const form = e.target
        const location = form.location.value
        const category = form.category.value
        const title = form.title.value
        const to = dates.endDate
        const from = dates.startDate
        const price = form.price.value
        const guests = form.total_guest.value
        const bathrooms = form.bathrooms.value
        const description = form.description.value
        const bedrooms = form.bedrooms.value
        const image = form.image.files[0]
        console.log(image)

        const host = {
            name: user?.displayName,
            image: user?.photoURL,
            email: user?.email,
        }
        try {

            const image_url = await imageUpload(image);
            console.log(image_url)

            const roomData = {
                location,
                category,
                title,
                to,
                from,
                price,
                guests,
                bathrooms,
                bedrooms,
                host,
                description,
                image: image_url,
            }
            console.table(roomData)
            await mutateAsync(roomData)
        }
        catch(err){
            toast.error("Somethis went wrong", err)
            setLoading(false)
        }
    }

    // handle image onchange
    const handleImage = image => {
        setImagePreview(URL.createObjectURL(image));
        setImageText(image.name)

    }
    return (
        <div>
            <Helmet>
                <title>Add Room || Dashboard</title>
            </Helmet>
            <AddRoomForm handleDates={handleDates} dates={dates} handleSubmit={handleSubmit} setImagePreview={setImagePreview} imagePreview={imagePreview} imageText={imageText} handleImage={handleImage} loading={loading}  ></AddRoomForm>
        </div>
    );
};

export default AddRoom;