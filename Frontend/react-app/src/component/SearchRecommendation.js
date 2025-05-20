import React from "react";
import { Avatar, ListItem, Typography } from "@mui/material";

const SearchRecommendation = ({
  anchorEl,
  recommendedProducts,
  open,
  onSelectProduct,
  searchQuery,
}) => {
  if (!open || !anchorEl || recommendedProducts.length === 0) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: "100%",
        left: 0,
        right: 0,
        backgroundColor: "white",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        borderRadius: "4px",
        zIndex: 1000,
        maxHeight: "400px",
        overflowY: "auto",
      }}
    >
      {recommendedProducts.map((product) => (
        <ListItem
          key={product.id}
          button
          onClick={() => onSelectProduct(product)}
          sx={{
            display: "flex",
            alignItems: "flex-start",
            padding: "8px 16px",
            "&:hover": {
              backgroundColor: "#f5f5f5",
            },
          }}
        >
          {product.isViewAll ? (
            <Typography fontStyle="italic" sx={{ padding: "8px 0" }}>
              {product.name}
            </Typography>
          ) : (
            <>
              <Avatar
                variant="square"
                src={product.images?.[0] || "/Images/placeholder.png"}
                sx={{ width: 48, height: 48, mr: 1 }}
              />
              <div>
                <Typography noWrap>
                  {product.name.split(new RegExp(`(${searchQuery})`, "i")).map((part, i) =>
                    part.toLowerCase() === searchQuery.toLowerCase()
                      ? <strong key={i}>{part}</strong>
                      : <span key={i}>{part}</span>
                  )}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {product.category}
                </Typography>
              </div>
            </>
          )}
        </ListItem>
      ))}
    </div>
  );
};

export default SearchRecommendation;
