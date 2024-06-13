import { useEffect, useState } from "react";
import { Button, Input, Modal, Select } from "./CustomTheme";
import { http, uploadPath } from "../helper/http";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams, useNavigate } from "react-router-dom";
const AddRoomComponent = () => {
  const navigate = useNavigate();
  const { _id } = useParams();
  const [isEdit, setIsEdit] = useState(false);
  const [hotel, setHotel] = useState("");
  const [hotels, setHotels] = useState([]);
  const [name, setName] = useState("");
  const [guestAllowed, setGuestAllowed] = useState("");
  const [amenities, setAmenities] = useState([]);
  const [price, setPrice] = useState("");
  const [wasPrice, setWasPrice] = useState("");
  const [roomAvailable, setRoomAvailable] = useState("");
  const [cancellationPolicy, setCancellationPolicy] = useState("");
  const [images, setImages] = useState([]); // [image1, image2, image3, ...]
  const [existImages, setExistImages] = useState([]);
  const [error, setError] = useState({
    hotel: false,
    name: false,
    guestAllowed: false,
    amenities: false,
    price: false,
    wasPrice: false,
    roomAvailable: false,
    cancellationPolicy: false,
    images: false,
  });

  useEffect(() => {
    getHotelIdsAndNames();
  }, []);
  useEffect(() => {
    if (_id) {
      setIsEdit(true);
      http.get(`/admin/get_room/${_id}`).then((res) => {
        const room = res.data.data;
        setHotel(room.hotel.name);
        setName(room.name);
        setGuestAllowed(room.guestAllowed);
        setAmenities(room.amenities);
        setPrice(room.price);
        setWasPrice(room.wasPrice);
        setRoomAvailable(room.roomAvailable);
        setCancellationPolicy(room.cancellationPolicy);
        setExistImages(room.images);
      });
    } else {
      init();
    }
  }, [_id]);

  const init = () => {
    setHotel("");
    setName("");
    setGuestAllowed("");
    setAmenities("");
    setPrice("");
    setWasPrice("");
    setRoomAvailable("");
    setCancellationPolicy("");
    setImages([]);
  };
  const getHotelIdsAndNames = () => {
    http
      .get("/admin/get_hotel_names")
      .then((res) => {
        if (res.data.message === "Hotel Names Fetched Successfully") {
          setHotels(res.data.hotels);
        } else {
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const checkAndSetError = (value, key) => {
    setError((prevError) => ({ ...prevError, [key]: !value }));
    return !value;
  };
  const saveRoom = () => {
    if (checkAndSetError(hotel, "hotel")) return;
    if (checkAndSetError(name, "name")) return;
    if (checkAndSetError(guestAllowed, "guestAllowed")) return;
    if (checkAndSetError(amenities.length, "amenities")) return;
    if (checkAndSetError(price, "price")) return;
    if (checkAndSetError(wasPrice, "wasPrice")) return;
    if (checkAndSetError(roomAvailable, "roomAvailable")) return;
    if (checkAndSetError(cancellationPolicy, "cancellationPolicy")) return;
    if (checkAndSetError(images.length || existImages.length, "images")) return;

    const formData = new FormData();

    formData.append("hotel", hotels.find((h) => h.name === hotel)._id);
    formData.append("name", name);
    formData.append("guestAllowed", guestAllowed);
    formData.append("amenities", JSON.stringify(amenities));
    formData.append("price", price);
    formData.append("wasPrice", wasPrice);
    formData.append("roomAvailable", roomAvailable);
    formData.append("cancellationPolicy", cancellationPolicy);

    images.forEach((image, index) => {
      formData.append("images", image, `image${index}.png`);
    });
    if (isEdit) {
      formData.append("id", _id);
      formData.append("existImages", JSON.stringify(existImages));

      http
        .post("/admin/update_room", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          if (res.data.message === "Room Updated Successfully") {
            toast.success("Room Updated Successfully");
            navigate("/dashboard/all_hotels");
          } else {
            toast.error("Failed to update room");
          }
        });
    } else {
      http
        .post("/admin/add_room", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          if (res.data.message === "Room Added Successfully") {
            toast.success("Room Added Successfully");
            init();
          } else {
            toast.error("Room Not Added Successfully");
          }
        });
    }
  };
  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    setImages((prevImages) => [...prevImages, ...files]);
  };
  const handleRemove = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };
  const handleRemoveExist = (index) => {
    setExistImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };
  return (
    <div className="flex flex-col gap-3 pb-5">
      <h1 className="text-4xl text-black text-left font-abril font-semibold mb-11">
        {isEdit ? "Edit Room" : "Add Room"}
      </h1>

      <Select
        options={hotels.map((hotel) => hotel.name) || []}
        value={hotel}
        onChange={(e) => setHotel(e.target.value)}
        placeholder="Select Hotel"
      />
      {error.hotel && <p className="text-red-500 pl-2">Hotel is required</p>}
      <Input
        type="text"
        placeholder="Room Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      {error.name && <p className="text-red-500 pl-2">Room Name is required</p>}
      <Input
        type="number"
        placeholder="Guest Allowed"
        value={guestAllowed}
        onChange={(e) => setGuestAllowed(e.target.value)}
      />
      {error.guestAllowed && (
        <p className="text-red-500 pl-2">Guest Allowed is required</p>
      )}
      <Modal
        placeholder={"Check Amenities"}
        options={["Free Wifi", "Swimming Pool", "Breakfast", "Lunch"]}
        values={amenities}
        onChange={(e) => setAmenities(e)}
      />
      {error.amenities && (
        <p className="text-red-500 pl-2">Amenities is required</p>
      )}
      <Select
        options={["Free Cancellation", "No Cancellation"]}
        value={cancellationPolicy}
        onChange={(e) => setCancellationPolicy(e.target.value)}
        placeholder="Select Cancellation Policy"
      />
      {error.cancellationPolicy && (
        <p className="text-red-500 pl-2">Cancellation Policy is required</p>
      )}
      <Input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      {error.price && <p className="text-red-500 pl-2">Price is required</p>}
      <Input
        type="number"
        placeholder="Was Price"
        value={wasPrice}
        onChange={(e) => setWasPrice(e.target.value)}
      />
      {error.wasPrice && (
        <p className="text-red-500 pl-2">Was Price is required</p>
      )}
      <Input
        type="number"
        placeholder="Room Available"
        value={roomAvailable}
        onChange={(e) => setRoomAvailable(e.target.value)}
      />
      {error.roomAvailable && (
        <p className="text-red-500 pl-2">Room Available is required</p>
      )}

      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        style={{ display: "none" }}
        id="fileUpload"
      />
      <div className="flex gap-3">
        {existImages.map((existImage, index) => (
          <div
            className="relative w-[66px] h-[66px] rounded-[10px] hover:bg-gray-200 cursor-pointer"
            key={index}
          >
            <img
              alt=""
              src={`${uploadPath}${existImage}`}
              className="absolute top-0 left-0 w-full h-full rounded-[10px]"
            />
            <div className="absolute top-0 left-0 w-full h-full rounded-[10px] flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
              <button
                className="p-1 bg-red-500 text-white rounded-full"
                onClick={() => handleRemoveExist(index)}
              >
                X
              </button>
            </div>
          </div>
        ))}
        {images.map((image, index) => (
          <div
            className="relative w-[66px] h-[66px] rounded-[10px] hover:bg-gray-200 cursor-pointer"
            key={index}
          >
            <img
              alt=""
              src={URL.createObjectURL(image)}
              className="absolute top-0 left-0 w-full h-full rounded-[10px]"
            />
            <div className="absolute top-0 left-0 w-full h-full rounded-[10px] flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
              <button
                className="p-1 bg-red-500 text-white rounded-full"
                onClick={() => handleRemove(index)}
              >
                X
              </button>
            </div>
          </div>
        ))}
        <button
          onClick={() => document.getElementById("fileUpload").click()}
          className="w-[66px] h-[66px] rounded-[10px] bg-white flex justify-center items-center"
        >
          <span className="text-black text-[26px] font-bold">+</span>
        </button>
      </div>
      {error.images && <p className="text-red-500 pl-2">Images is required</p>}
      <Button title={isEdit ? "Update Room" : "Add Room"} onClick={saveRoom} />
      <ToastContainer />
    </div>
  );
};

export default AddRoomComponent;
