export const links = [
  { title: "DashBoard" },
  { title: "Users" },
  {
    title: "Hotels",
    subLinks: [
      { title: "Add Hotel", path: "add_hotel" },
      {
        title: "Add Room To Hotel",
        path: "add_room",
      },
      {
        title: "List All Hotels",
        path: "all_hotels",
      },
    ],
  },
  {
    title: "Spots",
    subLinks: [
      { title: "Add Spot", path: "add_spot" },
      {
        title: "Add Ticket to Spot",
        path: "add_ticket",
      },
      { title: "List All Spots", path: "all_spots" },
    ],
  },
];
