// SearchRecommendation.js
import React from 'react';
import { Popper, Paper, List, ListItemText, ListItemButton } from '@mui/material';

function SearchRecommendation({ anchorEl, recommendedProducts, open, onSelectProduct }) {
  return (
    <Popper 
      open={open} 
      anchorEl={anchorEl} 
      placement="bottom-start" 
      disablePortal
      style={{ zIndex: 1300 }}
    >
      <Paper
        sx={{
          mt: 1,
          maxHeight: 300,
          overflowY: 'auto',
          width: anchorEl ? anchorEl.clientWidth : 'auto',
          pointerEvents: 'auto',
        }}
      >
        <List>
          {recommendedProducts && recommendedProducts.length > 0 ? (
            recommendedProducts.map((product) => (
              <ListItemButton 
                key={product.id || product._id} 
                onMouseDown={(e) => e.stopPropagation()}
                onClick={() => onSelectProduct(product)}
              >
                <ListItemText primary={`${product.name}`} />
              </ListItemButton>
            ))
          ) : (
            <ListItemButton onMouseDown={(e) => e.stopPropagation()}>
              <ListItemText primary="No recommendations found" />
            </ListItemButton>
          )}
        </List>
      </Paper>
    </Popper>
  );
}

export default SearchRecommendation;
