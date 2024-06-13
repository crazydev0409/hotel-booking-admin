import { useEffect, useState } from "react";
import { Button, Input, Modal, Select } from "./CustomTheme";
import { http, uploadPath } from "../helper/http";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams, useNavigate } from "react-router-dom";
const AddTicketComponent = () => {
  const navigate = useNavigate();
  const { _id } = useParams();
  const [isEdit, setIsEdit] = useState(false);
  const [spot, setSpot] = useState("");
  const [spots, setSpots] = useState([]);
  const [name, setName] = useState("");
  const [guestAllowed, setGuestAllowed] = useState("");
  const [amenities, setAmenities] = useState([]);
  const [cancellationPolicy, setCancellationPolicy] = useState("");
  const [price, setPrice] = useState("");
  const [wasPrice, setWasPrice] = useState("");
  const [roomAvailable, setRoomAvailable] = useState("");
  const [images, setImages] = useState([]); // [image1, image2, image3, ...]
  const [existImages, setExistImages] = useState([]);
  const [error, setError] = useState({
    spot: false,
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
    getSpotIdsAndNames();
  }, []);
  useEffect(() => {
    if (_id) {
      setIsEdit(true);
      http.get(`/admin/get_ticket/${_id}`).then((res) => {
        const {
          spot,
          name,
          guestAllowed,
          amenities,
          cancellationPolicy,
          price,
          wasPrice,
          roomAvailable,
          images,
        } = res.data.data;
        setSpot(spot.name);
        setName(name);
        setGuestAllowed(guestAllowed);
        setAmenities(amenities);
        setCancellationPolicy(cancellationPolicy);
        setPrice(price);
        setWasPrice(wasPrice);
        setRoomAvailable(roomAvailable);
        setExistImages(images);
      });
    } else {
      init();
    }
  }, [_id]);
  const init = () => {
    setSpot("");
    setName("");
    setGuestAllowed("");
    setAmenities("");
    setPrice("");
    setWasPrice("");
    setRoomAvailable("");
    setCancellationPolicy("");
    setImages([]);
  };
  const getSpotIdsAndNames = () => {
    http
      .get("/admin/get_spot_names")
      .then((res) => {
        if (res.data.message === "Spot Names Fetched Successfully") {
          setSpots(res.data.spots);
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
  const saveTicket = () => {
    if (checkAndSetError(spot, "spot")) return;
    if (checkAndSetError(name, "name")) return;
    if (checkAndSetError(guestAllowed, "guestAllowed")) return;
    if (checkAndSetError(amenities.length, "amenities")) return;
    if (checkAndSetError(cancellationPolicy, "cancellationPolicy")) return;
    if (checkAndSetError(price, "price")) return;
    if (checkAndSetError(wasPrice, "wasPrice")) return;
    if (checkAndSetError(roomAvailable, "roomAvailable")) return;
    if (checkAndSetError(images.length || existImages.length, "images")) return;
    const formData = new FormData();
    formData.append("spot", spots.find((h) => h.name === spot)._id);
    formData.append("name", name);
    formData.append("guestAllowed", guestAllowed);
    formData.append("amenities", JSON.stringify(amenities));
    formData.append("cancellationPolicy", cancellationPolicy);
    formData.append("price", price);
    formData.append("wasPrice", wasPrice);
    formData.append("roomAvailable", roomAvailable);
    images.forEach((image, index) => {
      formData.append("images", image, `image${index}.png`);
    });
    if (isEdit) {
      formData.append("id", _id);
      formData.append("existImages", JSON.stringify(existImages));
      http
        .post("/admin/update_ticket", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          if (res.data.message === "Ticket Updated Successfully") {
            toast.success("Ticket Updated Successfully");
            navigate("/dashboard/all_spots");
          } else {
            toast.error("Failed to update ticket");
          }
        });
    } else {
      http
        .post("/admin/add_ticket", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          if (res.data.message === "Ticket Added Successfully") {
            toast.success("Ticket Added Successfully");
            init();
          } else {
            toast.error("Failed to Add Ticket");
          }
        })
        .catch((err) => {
          console.log(err);
          toast.error("Failed to Add Ticket");
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
        {isEdit ? "Edit Ticket" : "Add Ticket"}
      </h1>

      <Select
        placeholder="Spot"
        value={spot}
        onChange={(e) => setSpot(e.target.value)}
        options={spots.map((spot) => spot.name) || []}
      />
      {error.spot && <p className="text-red-500 pl-2">Spot is required</p>}
      <Input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      {error.name && <p className="text-red-500 pl-2">Name is required</p>}
      <Input
        placeholder="Guest Allowed"
        value={guestAllowed}
        onChange={(e) => setGuestAllowed(e.target.value)}
        type={"number"}
      />
      {error.guestAllowed && (
        <p className="text-red-500 pl-2">Guest Allowed is required</p>
      )}
      <Input
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        type={"number"}
      />
      {error.price && <p className="text-red-500 pl-2">Price is required</p>}
      <Input
        placeholder="Was Price"
        value={wasPrice}
        onChange={(e) => setWasPrice(e.target.value)}
        type={"number"}
      />

      {error.wasPrice && (
        <p className="text-red-500 pl-2">Was Price is required</p>
      )}
      <Input
        placeholder="Room Available"
        value={roomAvailable}
        onChange={(e) => setRoomAvailable(e.target.value)}
        type={"number"}
      />
      {error.roomAvailable && (
        <p className="text-red-500 pl-2">Room Available is required</p>
      )}
      <Modal
        placeholder="Check Amenities"
        options={["Free Wifi", "Swimming Pool", "Breakfast", "Lunch"]}
        values={amenities}
        onChange={(e) => setAmenities(e)}
      />
      {error.amenities && (
        <p className="text-red-500 pl-2">Amenities is required</p>
      )}
      <Select
        placeholder="Select Cancellation Policy"
        value={cancellationPolicy}
        onChange={(e) => setCancellationPolicy(e.target.value)}
        options={["Free Cancellation", "No Cancellation"]}
      />
      {error.cancellationPolicy && (
        <p className="text-red-500 pl-2">Cancellation Policy is required</p>
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
      <Button
        title={isEdit ? "Update Ticket" : "Add Ticket"}
        onClick={saveTicket}
      />
      <ToastContainer />
    </div>
  );
};

export default AddTicketComponent;
