import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_DEALERS } from '../data/initialData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const AppContext = createContext();

const MAX_REGISTERED_OWNERS = 3;

// Default Primary Accounts State (Owner freshly reset to 1/3)
const INITIAL_ACCOUNTS = {
  OWNER: [
    { identifier: 'owner', phone: '9849000000', password: 'owner123', name: 'Owner', secretKey: '1234' }
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

  // Registered Accounts State
  const [registeredOwners, setRegisteredOwners] = useState(() => {
    const saved = localStorage.getItem('mm_registered_owners');
    return saved ? JSON.parse(saved) : INITIAL_ACCOUNTS.OWNER;
  });

  const [registeredDealers, setRegisteredDealers] = useState(() => {
    const saved = localStorage.getItem('mm_registered_dealers');
    return saved ? JSON.parse(saved) : INITIAL_ACCOUNTS.DEALER;
  });

  const [registeredWorkers, setRegisteredWorkers] = useState(() => {
    const saved = localStorage.getItem('mm_registered_workers');
    return saved ? JSON.parse(saved) : INITIAL_ACCOUNTS.WORKER;
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

  // Shopping Cart State
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

  // SYNC WITH SUPABASE IF CONFIGURED
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const fetchSupabaseData = async () => {
      try {
        const { data: dbDealers } = await supabase.from('dealers').select('*');
        if (dbDealers && dbDealers.length > 0) {
          setRegisteredDealers(dbDealers.map(d => ({
            identifier: d.phone,
            phone: d.phone,
            password: d.password,
            firmName: d.firm_name,
            address: d.address
          })));
        }

        const { data: dbOwners } = await supabase.from('owners').select('*');
        if (dbOwners && dbOwners.length > 0) {
          setRegisteredOwners(dbOwners.map(o => ({
            identifier: o.phone,
            phone: o.phone,
            password: o.password,
            name: o.name
          })));
        }

        const { data: dbWorkers } = await supabase.from('workers').select('*');
        if (dbWorkers && dbWorkers.length > 0) {
          setRegisteredWorkers(dbWorkers.map(w => ({
            identifier: w.phone,
            phone: w.phone,
            password: w.password,
            name: w.name,
            bayNo: w.bay_no
          })));
        }

        const { data: dbProducts } = await supabase.from('products').select('*');
        if (dbProducts && dbProducts.length > 0) {
          setProducts(dbProducts.map(p => ({
            id: p.id,
            title: p.title,
            category: p.category,
            spec: p.spec,
            price: Number(p.price),
            priceUnit: p.price_unit,
            isInStock: p.is_in_stock,
            minOrder: p.min_order,
            imageUrl: p.image_url
          })));
        }

        const { data: dbOrders } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
        if (dbOrders && dbOrders.length > 0) {
          setOrders(dbOrders.map(o => ({
            id: o.id,
            dealerFirm: o.dealer_firm,
            contact: o.contact,
            items: o.items,
            status: o.status,
            note: o.note,
            grandTotal: Number(o.grand_total),
            createdAt: o.created_at
          })));
        }
      } catch (err) {
        console.warn('Supabase fetch notice:', err);
      }
    };

    fetchSupabaseData();
  }, []);

  // Sync to local storage as fallback
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

  // LOAD & SAVE ISOLATED USER CART
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

  const showToast = (message, type = 'info') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // LOGIN AUTHENTICATION
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
    showToast('Logged out of MM Wood Boards & Laminates Portal', 'info');
  };

  // REGISTER OWNER
  const registerOwner = async (ownerData) => {
    const cleanPhone = (ownerData.phone || '').trim();

    if (registeredOwners.length >= MAX_REGISTERED_OWNERS) {
      showToast(`Registration Locked! Maximum limit of 3 owner accounts reached.`, 'error');
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

    if (isSupabaseConfigured) {
      await supabase.from('owners').insert([{
        phone: cleanPhone,
        name: ownerData.name || 'Owner',
        password: ownerData.password
      }]);
    }

    login('OWNER', cleanPhone, ownerData.password);
    triggerConfetti();
    showToast(`Owner Account for "${newOwner.name}" Created & Authenticated!`, 'success');
    return true;
  };

  // REGISTER DEALER
  const registerDealer = async (dealerData) => {
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

    if (isSupabaseConfigured) {
      await supabase.from('dealers').insert([{
        phone: cleanPhone,
        firm_name: dealerData.firmName,
        password: dealerData.password,
        address: dealerData.address || 'Industrial Area, Hyderabad'
      }]);
    }

    login('DEALER', cleanPhone, dealerData.password);
    triggerConfetti();
    showToast(`Dealer Shop "${newDealer.firmName}" Registered & Authenticated!`, 'success');
    return true;
  };

  // REGISTER WORKER
  const registerWorker = async (workerData) => {
    const cleanPhone = (workerData.phone || '').trim();

    if (registeredWorkers.some(w => (w.phone || '').includes(cleanPhone))) {
      showToast(`Registration Failed: Phone number ${cleanPhone} is already registered!`, 'error');
      return false;
    }

    const newWorker = {
      identifier: cleanPhone,
      phone: cleanPhone,
      password: workerData.password,
      name: workerData.name || 'Worker',
      bayNo: workerData.bayNo || 'Bay 4'
    };

    setRegisteredWorkers(prev => [...prev, newWorker]);

    if (isSupabaseConfigured) {
      await supabase.from('workers').insert([{
        phone: cleanPhone,
        name: workerData.name || 'Worker',
        password: workerData.password,
        bay_no: workerData.bayNo || 'Bay 4'
      }]);
    }

    login('WORKER', cleanPhone, workerData.password);
    triggerConfetti();
    showToast(`Godown Worker Account "${newWorker.name}" Registered & Logged In!`, 'success');
    return true;
  };

  // CART OPERATIONS
  const addToCart = (product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
    showToast(`Added ${quantity} × ${product.title} to order list`, 'success');
  };

  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item => (item.id === productId ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
    showToast('Removed item from order list', 'info');
  };

  const clearCart = () => {
    setCart([]);
  };

  // PLACE ORDER
  const placeOrder = async () => {
    if (cart.length === 0) {
      showToast('Order list is empty! Add plywood or laminates first.', 'error');
      return false;
    }

    const grandTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const newOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      dealerFirm: currentDealer.firmName,
      contact: `+91 ${currentDealer.phone} • GSTIN: ${currentDealer.gstin}`,
      items: [...cart],
      status: 'Pending Owner Approval',
      note: 'Placed via B2B Dealer Portal',
      grandTotal,
      createdAt: new Date().toISOString()
    };

    setOrders(prev => [newOrder, ...prev]);

    if (isSupabaseConfigured) {
      await supabase.from('orders').insert([{
        id: newOrder.id,
        dealer_firm: newOrder.dealerFirm,
        contact: newOrder.contact,
        items: newOrder.items,
        status: newOrder.status,
        note: newOrder.note,
        grand_total: newOrder.grandTotal
      }]);
    }

    clearCart();
    triggerConfetti();
    showToast(`Order #${newOrder.id} Placed Successfully! Sent to Owner for Approval.`, 'success');
    return true;
  };

  // CONFIRM ORDER
  const confirmOrder = async (orderId, note = '') => {
    const updatedStatus = 'Owner Confirmed - Sent to Worker Bay 4';
    setOrders(prev =>
      prev.map(o =>
        o.id === orderId
          ? { ...o, status: updatedStatus, note: note || o.note }
          : o
      )
    );

    if (isSupabaseConfigured) {
      await supabase.from('orders').update({ status: updatedStatus, note }).eq('id', orderId);
    }

    showToast(`Order #${orderId} Approved & Dispatched to Godown Worker!`, 'success');
  };

  // REJECT ORDER
  const rejectOrder = async (orderId, reason = '') => {
    const updatedStatus = 'Rejected by Owner';
    const note = `Rejected: ${reason || 'Out of stock in godown'}`;
    setOrders(prev =>
      prev.map(o =>
        o.id === orderId
          ? { ...o, status: updatedStatus, note }
          : o
      )
    );

    if (isSupabaseConfigured) {
      await supabase.from('orders').update({ status: updatedStatus, note }).eq('id', orderId);
    }

    showToast(`Order #${orderId} marked as Rejected.`, 'info');
  };

  // DISPATCH LOADING SLIP
  const dispatchOrder = async (orderId) => {
    const updatedStatus = 'Worker Loaded & Ready for Dispatch';
    setOrders(prev =>
      prev.map(o =>
        o.id === orderId
          ? { ...o, status: updatedStatus }
          : o
      )
    );

    if (isSupabaseConfigured) {
      await supabase.from('orders').update({ status: updatedStatus }).eq('id', orderId);
    }

    triggerConfetti();
    showToast(`Loading Slip Generated! Order #${orderId} Loaded & Ready for Dispatch.`, 'success');
  };

  // ADD NEW PRODUCT TO CATALOG
  const addProduct = async (newProdData) => {
    const id = `PROD-${Date.now()}`;
    const product = {
      id,
      title: newProdData.title,
      category: newProdData.category || 'Plywood',
      spec: newProdData.spec || 'Standard',
      price: Number(newProdData.price) || 1000,
      priceUnit: newProdData.priceUnit || 'sheet',
      isInStock: true,
      minOrder: Number(newProdData.minOrder) || 1,
      imageUrl: newProdData.imageUrl || 'https://images.unsplash.com/photo-1546484475-7f7bd55792da?auto=format&fit=crop&w=600&q=80'
    };

    setProducts(prev => [product, ...prev]);

    if (isSupabaseConfigured) {
      await supabase.from('products').insert([{
        id: product.id,
        title: product.title,
        category: product.category,
        spec: product.spec,
        price: product.price,
        price_unit: product.priceUnit,
        is_in_stock: product.isInStock,
        min_order: product.minOrder,
        image_url: product.imageUrl
      }]);
    }

    showToast(`Added "${product.title}" to Master Catalog!`, 'success');
  };

  // UPDATE PRODUCT
  const updateProduct = async (updatedProd) => {
    setProducts(prev =>
      prev.map(p => (p.id === updatedProd.id ? { ...p, ...updatedProd } : p))
    );

    if (isSupabaseConfigured) {
      await supabase.from('products').update({
        title: updatedProd.title,
        category: updatedProd.category,
        spec: updatedProd.spec,
        price: updatedProd.price,
        price_unit: updatedProd.priceUnit,
        is_in_stock: updatedProd.isInStock,
        min_order: updatedProd.minOrder,
        image_url: updatedProd.imageUrl
      }).eq('id', updatedProd.id);
    }

    showToast(`Updated details for "${updatedProd.title}"`, 'success');
  };

  // RESET ALL REGISTRATIONS
  const resetAllRegistrations = () => {
    setRegisteredOwners(INITIAL_ACCOUNTS.OWNER);
    setRegisteredDealers(INITIAL_ACCOUNTS.DEALER);
    setRegisteredWorkers(INITIAL_ACCOUNTS.WORKER);
    setProducts(INITIAL_PRODUCTS);
    setOrders(INITIAL_ORDERS);
    setCart([]);
    setIsAuthenticated(false);
    setCurrentUser(null);
    showToast('System Reset Complete! Restored primary owner (1/3 slots used)', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        currentUser,
        activeRole,
        setActiveRole,
        registeredOwners,
        registeredDealers,
        registeredWorkers,
        maxRegisteredOwners: MAX_REGISTERED_OWNERS,
        currentDealer,
        products,
        orders,
        cart,
        selectedCategory,
        setSelectedCategory,
        filterMM,
        setFilterMM,
        filterCore,
        setFilterCore,
        searchQuery,
        setSearchQuery,
        toast,
        confettiActive,
        login,
        logout,
        registerOwner,
        registerDealer,
        registerWorker,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        placeOrder,
        confirmOrder,
        rejectOrder,
        dispatchOrder,
        addProduct,
        updateProduct,
        resetAllRegistrations
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
