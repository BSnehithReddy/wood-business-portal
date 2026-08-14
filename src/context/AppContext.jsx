import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_DEALERS } from '../data/initialData';

const AppContext = createContext();

const MAX_REGISTERED_OWNERS = 3;

// Default Primary Accounts State (Owner freshly reset to 1/3)
const INITIAL_ACCOUNTS = {
  OWNER: [
    { identifier: 'father', phone: '9849000000', password: 'owner123', name: 'Owner', secretKey: '1234' }
  ],
  WORKER: [
    { identifier: 'worker', phone: '9000000000', password: 'worker123', name: 'Godown Warehouse Supervisor', bayNo: 'Bay 4' }
  ],
  DEALER: [
    { identifier: '9849012345', phone: '9849012345', password: 'dealer123', firmName: 'Shree Venkateshwara Hardware & Timber', contactPerson: 'Rajesh Kumar', address: 'Industrial Area, Hyderabad', gstin: '36AAACG1234F1Z5' }
  ]
};

export const AppProvider = ({ children }) => {
  // Authentication & Active User (Default: Logged Out Fresh Start)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Active Role: 'DEALER' | 'OWNER' | 'WORKER'
  const [activeRole, setActiveRole] = useState('DEALER');

  // Registered Owners (Freshly reset to 1/3 primary owner: father / 9849000000)
  const [registeredOwners, setRegisteredOwners] = useState(() => {
    return INITIAL_ACCOUNTS.OWNER;
  });

  const [registeredDealers, setRegisteredDealers] = useState(() => {
    return INITIAL_ACCOUNTS.DEALER;
  });

  const [registeredWorkers, setRegisteredWorkers] = useState(() => {
    return INITIAL_ACCOUNTS.WORKER;
  });

  // Current Active Dealer Details
  const [currentDealer, setCurrentDealer] = useState({
    firmName: 'Shree Venkateshwara Hardware & Timber',
    contactPerson: 'Rajesh Kumar',
    phone: '+91 98490 12345',
    gstin: '36AAACG1234F1Z5',
    address: 'Plot 42, Industrial Area, Phase II, Hyderabad'
  });

  // Products Catalog State
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('mm_products_catalog');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  // Orders State
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('mm_orders_list');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  // USER-ISOLATED SHOPPING CART STATE (Private per user account)
  const [cart, setCart] = useState([]);

  // Filtering & Search
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filterMM, setFilterMM] = useState('All');
  const [filterCore, setFilterCore] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Toast & Confetti Effects
  const [toast, setToast] = useState(null);
  const [confettiActive, setConfettiActive] = useState(false);

  const triggerConfetti = () => {
    setConfettiActive(true);
    setTimeout(() => setConfettiActive(false), 3500);
  };

  // Force Log Out on Startup / Reset Session & Clear Owner Storage
  useEffect(() => {
    localStorage.removeItem('mm_is_authenticated');
    localStorage.removeItem('mm_current_user');
    localStorage.removeItem('mm_registered_owners');
  }, []);

  // LOAD & SAVE ISOLATED USER CART PER USER PHONE / ID
  useEffect(() => {
    if (currentUser && currentUser.phone) {
      const savedCart = localStorage.getItem(`mm_cart_${currentUser.phone}`);
      setCart(savedCart ? JSON.parse(savedCart) : []);
    } else {
      setCart([]);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser && currentUser.phone) {
      localStorage.setItem(`mm_cart_${currentUser.phone}`, JSON.stringify(cart));
    }
  }, [cart, currentUser]);

  useEffect(() => {
    localStorage.setItem('mm_registered_owners', JSON.stringify(registeredOwners));
  }, [registeredOwners]);

  useEffect(() => {
    localStorage.setItem('mm_registered_dealers', JSON.stringify(registeredDealers));
  }, [registeredDealers]);

  useEffect(() => {
    localStorage.setItem('mm_registered_workers', JSON.stringify(registeredWorkers));
  }, [registeredWorkers]);

  useEffect(() => {
    localStorage.setItem('mm_products_catalog', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('mm_orders_list', JSON.stringify(orders));
  }, [orders]);

  const showToast = (message, type = 'info') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // STRICT LOGIN AUTHENTICATION FOR ALL 3 ROLES
  const login = (role, identifier, password) => {
    const cleanId = (identifier || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    let validAccount = null;

    if (role === 'OWNER') {
      validAccount = registeredOwners.find(
        acc => ((acc.identifier || acc.phone || '').toLowerCase() === cleanId || (acc.phone || '').includes(cleanId)) && acc.password === cleanPass
      );
    } else if (role === 'WORKER') {
      validAccount = registeredWorkers.find(
        acc => ((acc.identifier || acc.phone || '').toLowerCase() === cleanId || (acc.phone || '').includes(cleanId)) && acc.password === cleanPass
      );
    } else {
      validAccount = registeredDealers.find(
        acc => ((acc.identifier || acc.phone || '').toLowerCase() === cleanId || (acc.phone || '').includes(cleanId)) && acc.password === cleanPass
      );
    }

    if (!validAccount) {
      showToast(`Login Failed for ${role}: Incorrect Phone/Username or Password! Access Denied.`, 'error');
      return false;
    }

    const userObj = {
      name: validAccount.name || validAccount.firmName || 'User',
      role,
      phone: validAccount.phone || cleanId,
      loginTime: new Date().toLocaleTimeString()
    };

    if (role === 'DEALER' && validAccount.firmName) {
      setCurrentDealer({
        firmName: validAccount.firmName,
        contactPerson: validAccount.contactPerson || 'Proprietor',
        phone: validAccount.phone || cleanId,
        gstin: validAccount.gstin || '36AAACG1234F1Z5',
        address: validAccount.location || validAccount.address || 'Industrial Area, Hyderabad'
      });
    }

    setActiveRole(role);
    setCurrentUser(userObj);
    setIsAuthenticated(true);

    // Load isolated cart for logged in user
    const userCart = localStorage.getItem(`mm_cart_${userObj.phone}`);
    setCart(userCart ? JSON.parse(userCart) : []);

    triggerConfetti();
    showToast(`Access Granted! Welcome ${userObj.name} (${role} Portal)`, 'success');
    return true;
  };

  const logout = () => {
    if (currentUser && currentUser.phone) {
      localStorage.setItem(`mm_cart_${currentUser.phone}`, JSON.stringify(cart));
    }
    setIsAuthenticated(false);
    setCurrentUser(null);
    setCart([]);
    localStorage.removeItem('mm_is_authenticated');
    localStorage.removeItem('mm_current_user');
    showToast('Logged out of MM Wood Boards & Laminates Portal', 'info');
  };

  // REGISTER OWNER (STRICTLY CAPPED AT 3 PHONE NUMBERS MAX)
  const registerOwner = (ownerData) => {
    const cleanPhone = (ownerData.phone || '').trim();

    if (registeredOwners.length >= MAX_REGISTERED_OWNERS) {
      showToast(`Registration Locked! Maximum limit of 3 owner accounts reached. No more signups permitted.`, 'error');
      return false;
    }

    if (registeredOwners.some(o => (o.phone || '').includes(cleanPhone))) {
      showToast(`Registration Failed: Phone number ${cleanPhone} is already registered!`, 'error');
      return false;
    }

    const newOwner = {
      identifier: cleanPhone || ownerData.name,
      phone: cleanPhone,
      password: ownerData.password,
      name: ownerData.name || 'Owner',
      secretKey: ownerData.secretKey || '1234'
    };

    setRegisteredOwners(prev => [...prev, newOwner]);
    login('OWNER', cleanPhone, ownerData.password);
    triggerConfetti();
    showToast(`Owner Account for "${newOwner.name}" Created & Authenticated! (${registeredOwners.length + 1}/${MAX_REGISTERED_OWNERS} slots used)`, 'success');
    return true;
  };

  // REGISTER DEALER
  const registerDealer = (dealerData) => {
    const cleanPhone = (dealerData.phone || '').trim();

    if (registeredDealers.some(d => (d.phone || '').includes(cleanPhone))) {
      showToast(`Registration Failed: Phone number ${cleanPhone} is already registered!`, 'error');
      return false;
    }

    const newDealer = {
      identifier: cleanPhone,
      phone: cleanPhone,
      password: dealerData.password,
      firmName: dealerData.firmName,
      contactPerson: dealerData.contactPerson || 'Proprietor',
      address: dealerData.address || 'Industrial Area, Hyderabad',
      gstin: dealerData.gstin || '36AAACG0000F1Z0'
    };

    setRegisteredDealers(prev => [...prev, newDealer]);
    setCurrentDealer({
      firmName: dealerData.firmName,
      contactPerson: dealerData.contactPerson || 'Proprietor',
      phone: cleanPhone,
      gstin: dealerData.gstin || '36AAACG0000F1Z0',
      address: dealerData.address || 'Industrial Area, Hyderabad'
    });

    login('DEALER', cleanPhone, dealerData.password);
    triggerConfetti();
    showToast(`Dealer Firm "${dealerData.firmName}" Registered & Authenticated!`, 'success');
    return true;
  };

  // REGISTER WORKER
  const registerWorker = (workerData) => {
    const cleanPhone = (workerData.phone || '').trim();

    if (registeredWorkers.some(w => (w.phone || '').includes(cleanPhone))) {
      showToast(`Registration Failed: Phone number ${cleanPhone} is already registered!`, 'error');
      return false;
    }

    const newWorker = {
      identifier: cleanPhone || workerData.name,
      phone: cleanPhone,
      password: workerData.password,
      name: workerData.name || 'Godown Worker',
      bayNo: workerData.bayNo || 'Bay 1'
    };

    setRegisteredWorkers(prev => [...prev, newWorker]);
    login('WORKER', cleanPhone, workerData.password);
    triggerConfetti();
    showToast(`Worker Account for "${newWorker.name}" Created & Authenticated!`, 'success');
    return true;
  };

  // FORCE LOGOUT ALL & RESET REGISTRATIONS RESTART
  const resetAllRegistrations = () => {
    setRegisteredOwners(INITIAL_ACCOUNTS.OWNER);
    setRegisteredDealers(INITIAL_ACCOUNTS.DEALER);
    setRegisteredWorkers(INITIAL_ACCOUNTS.WORKER);
    setProducts(INITIAL_PRODUCTS);
    setOrders(INITIAL_ORDERS);
    setCart([]);
    localStorage.removeItem('mm_registered_owners');
    localStorage.removeItem('mm_registered_dealers');
    localStorage.removeItem('mm_registered_workers');
    localStorage.removeItem('mm_products_catalog');
    localStorage.removeItem('mm_orders_list');
    localStorage.removeItem('mm_is_authenticated');
    localStorage.removeItem('mm_current_user');
    setIsAuthenticated(false);
    setCurrentUser(null);
    showToast('All owner accounts logged out & slots freshly set to 1 / 3!', 'info');
  };

  // Cart Handlers (Isolated to active user)
  const addToCart = (product, quantity = 1) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prev, { ...product, quantity }];
      }
    });
    showToast(`Added ${quantity} ${product.unit}(s) of ${product.name} to cart`, 'success');
  };

  const updateCartQuantity = (productId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => item.id === productId ? { ...item, quantity: newQty } : item));
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
    showToast('Item removed from cart', 'warning');
  };

  const clearCart = () => {
    setCart([]);
    if (currentUser && currentUser.phone) {
      localStorage.removeItem(`mm_cart_${currentUser.phone}`);
    }
  };

  // Order Placement
  const placeOrder = (deliveryNotes = '') => {
    if (cart.length === 0) return;

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const taxGst = Math.round(subtotal * 0.18);
    const grandTotal = subtotal + taxGst;

    const newOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      dealerName: currentDealer.firmName,
      dealerContact: currentDealer.phone,
      dealerGst: currentDealer.gstin,
      deliveryAddress: currentDealer.address,
      orderDate: new Date().toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' }),
      items: cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        unit: item.unit,
        total: item.price * item.quantity,
        verified: false
      })),
      subtotal,
      taxGst,
      grandTotal,
      status: 'Pending Owner Approval',
      notes: deliveryNotes,
      history: [
        { status: 'Pending Owner Approval', timestamp: new Date().toLocaleTimeString(), by: 'Dealer' }
      ]
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    triggerConfetti();
    showToast(`🎉 Order #${newOrder.id} submitted to Owner for approval!`, 'success');
  };

  // Owner Actions
  const confirmOrder = (orderId, ownerNote = '') => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          status: 'Confirmed by Owner',
          loadingStatus: 'Pending Loading',
          ownerNote: ownerNote || 'Order confirmed by Owner. Forwarded to Godown for loading.',
          history: [
            ...order.history,
            { status: 'Confirmed by Owner', timestamp: new Date().toLocaleTimeString(), by: 'Owner' }
          ]
        };
      }
      return order;
    }));
    triggerConfetti();
    showToast(`🎉 Order #${orderId} CONFIRMED BY OWNER! Sent to Godown Worker interface immediately.`, 'success');
  };

  const rejectOrder = (orderId, reason = 'Out of Stock') => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          status: 'Rejected by Owner',
          ownerNote: reason,
          history: [
            ...order.history,
            { status: 'Rejected', timestamp: new Date().toLocaleTimeString(), by: 'Owner' }
          ]
        };
      }
      return order;
    }));
    showToast(`Order #${orderId} marked as Rejected/No Stock.`, 'error');
  };

  // Worker Loading Item Verification Checklist
  const toggleItemVerified = (orderId, itemIndex) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        const updatedItems = [...order.items];
        updatedItems[itemIndex] = {
          ...updatedItems[itemIndex],
          verified: !updatedItems[itemIndex].verified
        };
        return { ...order, items: updatedItems };
      }
      return order;
    }));
  };

  // Worker Dispatch Actions
  const updateLoadingStatus = (orderId, newLoadingStatus, vehicleNumber = '', driverPhone = '') => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        let orderOverallStatus = order.status;
        if (newLoadingStatus === 'Out for Delivery') {
          orderOverallStatus = 'Out for Delivery';
        } else if (newLoadingStatus === 'Loading In Progress') {
          orderOverallStatus = 'Worker Loading';
        }

        return {
          ...order,
          status: orderOverallStatus,
          loadingStatus: newLoadingStatus,
          vehicleNumber: vehicleNumber || order.vehicleNumber || 'AP-28-TA-5544',
          driverPhone: driverPhone || order.driverPhone || '+91 98490 99887',
          history: [
            ...order.history,
            { status: newLoadingStatus, timestamp: new Date().toLocaleTimeString(), by: 'Godown Worker' }
          ]
        };
      }
      return order;
    }));
    if (newLoadingStatus === 'Out for Delivery') {
      triggerConfetti();
    }
    showToast(`Order #${orderId} status updated to: ${newLoadingStatus}`, 'info');
  };

  // Catalog CRUD
  const addProduct = (newProduct) => {
    const id = `PROD-${Math.floor(100 + Math.random() * 900)}`;
    const productWithId = {
      ...newProduct,
      id,
      rating: 5.0,
      inStock: newProduct.stock > 0
    };
    setProducts(prev => [productWithId, ...prev]);
    showToast(`New product "${newProduct.name}" added to catalog!`, 'success');
  };

  const editProduct = (productId, updatedFields) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        return {
          ...p,
          ...updatedFields,
          inStock: updatedFields.stock > 0
        };
      }
      return p;
    }));
    showToast(`Product specifications updated!`, 'success');
  };

  const deleteProduct = (productId) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    showToast(`Product removed from catalog`, 'warning');
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        currentUser,
        login,
        logout,
        registerDealer,
        registerOwner,
        registerWorker,
        resetAllRegistrations,
        registeredOwners,
        registeredDealers,
        registeredWorkers,
        maxRegisteredOwners: MAX_REGISTERED_OWNERS,
        activeRole,
        setActiveRole,
        currentDealer,
        setCurrentDealer,
        products,
        orders,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        placeOrder,
        confirmOrder,
        rejectOrder,
        toggleItemVerified,
        updateLoadingStatus,
        addProduct,
        editProduct,
        deleteProduct,
        selectedCategory,
        setSelectedCategory,
        filterMM,
        setFilterMM,
        filterCore,
        setFilterCore,
        searchQuery,
        setSearchQuery,
        toast,
        showToast,
        confettiActive
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
