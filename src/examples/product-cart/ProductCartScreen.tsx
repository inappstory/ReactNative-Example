import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { StoryManager, ProductCart, ProductCartOffer } from '@inappstory/react-native-sdk';
import { INITIAL_CART, LocalCartState, LocalCartItem, MOCK_CATALOG } from './cartData';
import { config as iasConfig } from '../../config';

export const ProductCartScreen: React.FC = () => {
  const [cartState, setCartState] = useState<LocalCartState>(INITIAL_CART);
  const [status, setStatus] = useState<string>('Ready');

  // We use a ref to hold the latest cart state so that SDK handlers always read the fresh value
  // without needing to re-register the handlers on every render.
  const cartStateRef = useRef<LocalCartState>(cartState);
  
  useEffect(() => {
    cartStateRef.current = cartState;
  }, [cartState]);

  const handleClearCart = () => {
    setCartState({
      items: [],
      totalPrice: 0,
      currency: 'EUR',
    });
  };

  useEffect(() => {
    const manager = new StoryManager(iasConfig as any);

    // T014, T015: getState handler
    const getState = async (): Promise<ProductCart | null> => {
      try {
        const state = cartStateRef.current;
        if (state.items.length === 0) {
          return null; // SDK semantics for empty cart
        }

        const productCart: ProductCart = {
          price: state.totalPrice.toFixed(2),
          priceCurrency: state.currency,
          offers: state.items.map(item => ({
            offerId: item.offerId,
            quantity: item.quantity,
            price: item.price,
            currency: item.currency,
            name: item.name,
          }) as ProductCartOffer),
        };
        
        setStatus('SDK Requested State');
        return productCart;
      } catch (e) {
        setStatus(`Error in getState: ${e}`);
        return null;
      }
    };

    // T018, T019, T020: onUpdate handler
    const onUpdate = async (offer: ProductCartOffer): Promise<ProductCart | null> => {
      try {
        let updatedState = { ...cartStateRef.current, items: [...cartStateRef.current.items] };
        
        const existingIndex = updatedState.items.findIndex(i => i.offerId === offer.offerId);

        if (offer.quantity && offer.quantity > 0) {
          // Add or Update
          if (existingIndex >= 0) {
            updatedState.items[existingIndex].quantity = offer.quantity;
          } else {
            // Find in catalog
            const catalogItem = MOCK_CATALOG[offer.offerId];
            if (catalogItem) {
              updatedState.items.push({
                ...catalogItem,
                quantity: offer.quantity,
              });
            } else {
              // Ignore unknown item or add dynamically
              updatedState.items.push({
                offerId: offer.offerId,
                name: offer.name || 'Unknown Item',
                price: offer.price || '0',
                currency: offer.currency || 'EUR',
                quantity: offer.quantity,
              });
            }
          }
        } else {
          // Remove
          if (existingIndex >= 0) {
            updatedState.items.splice(existingIndex, 1);
          }
        }

        // Recalculate total
        const newTotal = updatedState.items.reduce((sum, item) => {
          return sum + (parseFloat(item.price || '0') * item.quantity);
        }, 0);
        
        updatedState.totalPrice = newTotal;
        
        // Update local state and ref immediately
        setCartState(updatedState);
        cartStateRef.current = updatedState;

        setStatus(`SDK Updated Cart (offer: ${offer.offerId})`);

        return getState();
      } catch (e) {
        setStatus(`Error in onUpdate: ${e}`);
        return null;
      }
    };

    // T016, T021: Register handlers
    manager.setProductCartHandlers({ onUpdate, getState });

    // T023, T024: Cart Click Interaction
    const onCartClicked = () => {
      setStatus('Checkout Requested: Cart Clicked inside Story');
    };
    
    if (typeof (manager as any).on === 'function') {
      (manager as any).on('productCartClicked', onCartClicked);
    } else {
      manager.onProductCartClicked(onCartClicked);
    }

    // T025: Cleanup
    return () => {
      if (typeof (manager as any).off === 'function') {
        (manager as any).off('productCartClicked', onCartClicked);
      }
      // setProductCartHandlers doesn't strictly have an unregister in v1, 
      // but passing nulls or empty object might clear it if needed.
    };
  }, []);

  const openStory = () => {
    if (iasConfig.productCartStoryId) {
       setStatus('Opening story...');
       const manager = new StoryManager(iasConfig as any);
       manager.showStory(iasConfig.productCartStoryId);
    } else {
       setStatus('Error: productCartStoryId not configured in iasConfig');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.actionButton} onPress={openStory}>
        <Text style={styles.actionButtonText}>Open Product Cart Story</Text>
      </TouchableOpacity>

      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>Status: {status}</Text>
      </View>

      <View style={styles.cartContainer}>
        {cartState.items.map(item => (
          <View key={item.offerId} style={styles.cartItem}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemDetail}>Price: {item.price} {item.currency}</Text>
            <Text style={styles.itemDetail}>Quantity: {item.quantity}</Text>
          </View>
        ))}
        {cartState.items.length === 0 && (
          <Text style={styles.emptyText}>Cart is empty</Text>
        )}
        
        <View style={styles.footer}>
          <Text style={styles.totalText}>Total: {cartState.totalPrice.toFixed(2)} {cartState.currency}</Text>
          <TouchableOpacity style={styles.button} onPress={handleClearCart}>
            <Text style={styles.buttonText}>Clear Cart</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F4F5F7',
  },
  statusContainer: {
    padding: 12,
    backgroundColor: '#EAE6FF',
    borderRadius: 8,
    marginBottom: 16,
  },
  statusText: {
    color: '#403294',
    fontWeight: '600',
  },
  actionButton: {
    backgroundColor: '#0052CC',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  cartContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 40,
  },
  cartItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#DFE1E6',
    paddingVertical: 8,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#172B4D',
  },
  itemDetail: {
    fontSize: 14,
    color: '#5E6C84',
    marginTop: 4,
  },
  emptyText: {
    fontSize: 16,
    color: '#5E6C84',
    fontStyle: 'italic',
    paddingVertical: 12,
  },
  footer: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#172B4D',
  },
  button: {
    backgroundColor: '#FF5630',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
