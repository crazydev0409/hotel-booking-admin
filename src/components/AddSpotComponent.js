import { useEffect, useState } from "react";
import {
  Button,
  GoogleAutocomplete,
  Input,
  Modal,
  TextArea,
} from "./CustomTheme";
import { http, uploadPath } from "../helper/http";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams, useNavigate } from "react-router-dom";
import EditIcon from "./SvgIcons/EditIcon";
import DeleteIcon from "./SvgIcons/DeleteIcon";
const AddSpotComponent = () => {
  const navigate = useNavigate();
  const { _id } = useParams();
  const [isEdit, setIsEdit] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [position, setPosition] = useState([0, 0]);
  const [amenities, setAmenities] = useState([]);
  const [entrancePolicies, setEntrancePolicies] = useState([]);
  const [closingPolicies, setClosingPolicies] = useState([]);
  const [openingDays, setOpeningDays] = useState([]);
  const [images, setImages] = useState([]);
  const [existImages, setExistImages] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState({
    name: false,
    description: false,
    location: false,
    amenities: false,
    entrancePolicies: false,
    closingPolicies: false,
    openingDays: false,
    images: false,
  });

  useEffect(() => {
    if (_id) {
      setIsEdit(true);
      http.get(`/admin/get_spot/${_id}`).then((res) => {
        const {
          name,
          description,
          location,
          position,
          amenities,
          entrancePolicies,
          closingPolicies,
          openingDays,
          images,
          tickets,
        } = res.data.data;
        setName(name);
        setDescription(description);
        setLocation(location);
        setPosition([position.lat, position.lng]);
        setAmenities(amenities);
        setEntrancePolicies(entrancePolicies);
        setClosingPolicies(closingPolicies);
        setOpeningDays(openingDays);
        setExistImages(images);
        setTickets(tickets);
      });
    } else {
      init();
    }
  }, [_id]);
  const init = () => {
    setName("");
    setDescription("");
    setLocation("");
    setPosition([0, 0]);
    setAmenities([]);
    setEntrancePolicies([]);
    setClosingPolicies([]);
    setOpeningDays([]);
    setImages([]);
  };
  const checkAndSetError = (value, key) => {
    setError((prevError) => ({ ...prevError, [key]: !value }));
    return !value;
  };
  const saveSpot = () => {
    if (checkAndSetError(name, "name")) return;
    if (checkAndSetError(description, "description")) return;
    if (
      checkAndSetError(
        location && position.some((pos) => pos !== 0),
        "location"
      )
    )
      return;
    if (checkAndSetError(amenities.length, "amenities")) return;
    if (checkAndSetError(entrancePolicies.length, "entrancePolicies")) return;
    if (checkAndSetError(closingPolicies.length, "closingPolicies")) return;
    if (checkAndSetError(openingDays.length, "openingDays")) return;
    if (checkAndSetError(images.length || existImages.length, "images")) return;
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("location", location);
    formData.append("position", JSON.stringify(position));
    formData.append("amenities", JSON.stringify(amenities));
    formData.append("entrancePolicies", JSON.stringify(entrancePolicies));
    formData.append("closingPolicies", JSON.stringify(closingPolicies));
    formData.append("openingDays", JSON.stringify(openingDays));
    images.forEach((image, index) => {
      formData.append("images", image, `image${index}.png`);
    });
    if (isEdit) {
      formData.append("existImages", JSON.stringify(existImages));
      formData.append("id", _id);

      http
        .post("/admin/update_spot", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          if (res.data.message === "Spot Updated Successfully") {
            toast.success("Spot Updated Successfully");
            navigate("/dashboard/all_spots");
          } else {
            toast.error("Failed to update spot");
          }
        });
    } else {
      http
        .post("/admin/add_spot", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          toast.success(res.data.message);
          init();
        })
        .catch((err) => {
          toast.error(err.response.data.message);
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
  const toEdit = (_id) => {
    navigate(`/dashboard/add_ticket/${_id}`);
  };

  const toDelete = (_id) => {
    http.delete(`/admin/delete_ticket/${_id}`).then((response) => {
      if (response.data.message === "Ticket deleted successfully") {
        toast.success("Ticket deleted successfully");
        http.get("/admin/get_tickets").then((response) => {
          setTickets(response.data.tickets);
        });
      }
    });
  };
  return (
    <div className="flex gap-8">
      <div className="flex flex-col gap-3 pb-5">
        <h1 className="text-4xl text-black text-left font-abril font-semibold mb-11">
          {isEdit ? "Edit Spot" : "Add Spot"}
        </h1>

        <Input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {error.name && <p className="text-red-500 pl-2">Name is required</p>}
        <TextArea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {error.description && (
          <p className="text-red-500 pl-2">Description is required</p>
        )}
        <GoogleAutocomplete
          placeholder="Location"
          value={location}
          getLocation={(location) => setPosition([location.lat, location.lng])}
          getAddress={(address) => setLocation(address)}
        />
        {error.location && (
          <p className="text-red-500 pl-2">Location is required</p>
        )}
        <Modal
          placeholder="Amenities"
          options={["Wifi", "Parking", "Pool", "Gym", "Restaurant"]}
          values={amenities}
          onChange={(value) => setAmenities(value)}
        />
        {error.amenities && (
          <p className="text-red-500 pl-2">Amenities is required</p>
        )}
        <Modal
          placeholder="Entrance Policies"
          options={["ID Card", "Passport", "Driving License"]}
          values={entrancePolicies}
          onChange={(value) => setEntrancePolicies(value)}
        />
        {error.entrancePolicies && (
          <p className="text-red-500 pl-2">Entrance Policies is required</p>
        )}
        <Modal
          placeholder="Closing Policies"
          options={["10 PM", "11 PM", "12 PM"]}
          values={closingPolicies}
          onChange={(value) => setClosingPolicies(value)}
        />
        {error.closingPolicies && (
          <p className="text-red-500 pl-2">Closing Policies is required</p>
        )}
        <Modal
          placeholder="Opening Days"
          options={[
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ]}
          values={openingDays}
          onChange={(value) => setOpeningDays(value)}
        />
        {error.openingDays && (
          <p className="text-red-500 pl-2">Opening Days is required</p>
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
        {error.images && (
          <p className="text-red-500 pl-2">Images is required</p>
        )}
        <Button
          title={isEdit ? "Update Spot" : "Add Spot"}
          onClick={saveSpot}
        />
        <ToastContainer />
      </div>
      {isEdit && (
        <div className="flex flex-col gap-3">
          <h1 className="text-4xl text-black text-left font-abril font-semibold mb-11">
            Ticket Lists
          </h1>
          <div>
            {tickets.map((hotel) => (
              <div key={hotel.id} className="flex gap-2">
                <div className="w-[300px] h-[60px] rounded-[13px] px-5 bg-white flex items-center mb-2 text-ellipsis">
                  {hotel.name}
                </div>
                <div
                  className="h-[60px] w-[60px] rounded-[13px] bg-white flex items-center justify-center cursor-pointer hover:bg-[#EEE] p-3"
                  onClick={() => toEdit(hotel._id)}
                >
                  <EditIcon />
                </div>
                <div
                  className="h-[60px] w-[60px] rounded-[13px] bg-white flex items-center justify-center cursor-pointer hover:bg-[#EEE] p-3"
                  onClick={() => toDelete(hotel._id)}
                >
                  <DeleteIcon />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AddSpotComponent;
