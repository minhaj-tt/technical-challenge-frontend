import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function OutlinedCard({
  first_name,
  last_name,
  role,
}) {
  return (
    <Box
      sx={{
        minWidth: 275,
        display: "flex",
        justifyContent: "center",
        marginTop: 4,
      }}
    >
      <Card
        variant="outlined"
        sx={{
          width: 300,
          borderRadius: 3,
          boxShadow: 10,
          backgroundColor: "#f9f9f9",
          transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease",
          "&:hover": {
            transform: "translateY(-8px)",
            boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        <CardContent>
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              fontSize: 14,
              fontStyle: "italic",
            }}
          >
            {first_name}
          </Typography>
          <Typography
            variant="h5"
            component="div"
            sx={{
              fontWeight: "bold",
              color: "#333",
              textTransform: "uppercase",
            }}
          >
            {last_name}
          </Typography>
          <Typography
            sx={{
              color: "text.secondary",
              mb: 1.5,
              fontSize: 14,
              fontWeight: "medium",
            }}
          >
            {role ? `Status: ${role}` : `Role: ${role}`}
          </Typography>
        </CardContent>
        <CardActions sx={{ justifyContent: "end", padding: 1 }}>
          <IconButton
            size="small"
            sx={{
              backgroundColor: "#1976d2",
              color: "white",
              borderRadius: 3,
              "&:hover": {
                backgroundColor: "#1565c0",
              },
            }}
            aria-label="edit"
          >
            <EditIcon />
          </IconButton>
          <IconButton
            size="small"
            sx={{
              backgroundColor: "#d32f2f",
              color: "white",
              borderRadius: 3,
              "&:hover": {
                backgroundColor: "#c62828",
              },
            }}
            aria-label="delete"
          >
            <DeleteIcon />
          </IconButton>
        </CardActions>
      </Card>
    </Box>
  );
}
