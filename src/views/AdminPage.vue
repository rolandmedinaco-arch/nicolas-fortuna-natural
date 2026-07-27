<template>
  <div class="admin-page">
    <!-- Login -->
    <div v-if="!authenticated" class="admin-login">
      <div class="login-card">
        <h1>🌿 Fortuna Natural</h1>
        <h2>Panel de Administración</h2>
        <div class="login-form">
          <input
            type="password"
            v-model="password"
            placeholder="Contraseña de administrador"
            @keyup.enter="login"
          />
          <button @click="login" :disabled="!password">Ingresar</button>
          <p v-if="loginError" class="login-error">{{ loginError }}</p>
        </div>
      </div>
    </div>

    <!-- Panel -->
    <div v-else class="admin-panel">
      <!-- Header -->
      <header class="admin-header">
        <div class="admin-header-left">
          <h1>🌿 Fortuna Natural — Admin</h1>
        </div>
        <div class="admin-header-right">
          <button class="btn-refresh" @click="fetchOrders">🔄 Actualizar</button>
          <button class="btn-logout" @click="logout">Cerrar sesión</button>
        </div>
      </header>

      <!-- Stats -->
      <div class="admin-stats">
        <div class="stat-card">
          <span class="stat-number">{{ orders.length }}</span>
          <span class="stat-label">Total pedidos</span>
        </div>
        <div class="stat-card stat-pending">
          <span class="stat-number">{{ ordersByStatus('pending') }}</span>
          <span class="stat-label">Pendientes</span>
        </div>
        <div class="stat-card stat-paid">
          <span class="stat-number">{{ ordersByStatus('paid') }}</span>
          <span class="stat-label">Pagados</span>
        </div>
        <div class="stat-card stat-shipped">
          <span class="stat-number">{{ ordersByStatus('shipped') }}</span>
          <span class="stat-label">Enviados</span>
        </div>
      </div>

      <!-- Filters -->
      <div class="admin-filters">
        <select v-model="filterStatus" @change="fetchOrders">
          <option value="all">Todos los estados</option>
          <option value="pending">Pendientes</option>
          <option value="paid">Pagados</option>
          <option value="shipped">Enviados</option>
          <option value="delivered">Entregados</option>
          <option value="cancelled">Cancelados</option>
        </select>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="admin-loading">Cargando pedidos...</div>

      <!-- Error -->
      <div v-if="error" class="admin-error">{{ error }}</div>

      <!-- Orders Table -->
      <div v-if="!loading && orders.length > 0" class="admin-table-wrap">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>Email</th>
              <th>Ciudad</th>
              <th>Productos</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Pago</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in orders" :key="order.id" @click="selectOrder(order)">
              <td>{{ formatDate(order.created_at) }}</td>
              <td>{{ order.customer_first_name }} {{ order.customer_last_name }}</td>
              <td>{{ order.customer_email }}</td>
              <td>{{ order.shipping_city }}</td>
              <td>{{ formatItems(order.items) }}</td>
              <td class="td-total">{{ formatPrice(order.total) }}</td>
              <td><span class="badge" :class="'badge-' + order.status">{{ statusLabel(order.status) }}</span></td>
              <td><span class="badge" :class="'badge-' + order.payment_status">{{ paymentLabel(order.payment_status) }}</span></td>
              <td>
                <button class="btn-detail" @click.stop="selectOrder(order)">Ver</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty -->
      <div v-if="!loading && orders.length === 0" class="admin-empty">
        No hay pedidos {{ filterStatus !== 'all' ? 'con este filtro' : 'aún' }}.
      </div>

      <!-- Order Detail Modal -->
      <div v-if="selectedOrder" class="modal-overlay" @click.self="selectedOrder = null">
        <div class="modal-content">
          <div class="modal-header">
            <h2>Pedido #{{ selectedOrder.id.slice(0, 8) }}</h2>
            <button class="modal-close" @click="selectedOrder = null">✕</button>
          </div>

          <div class="modal-body">
            <div class="detail-section">
              <h3>Cliente</h3>
              <p><strong>Nombre:</strong> {{ selectedOrder.customer_first_name }} {{ selectedOrder.customer_last_name }}</p>
              <p><strong>Email:</strong> {{ selectedOrder.customer_email }}</p>
              <p><strong>Teléfono:</strong> {{ selectedOrder.customer_phone }}</p>
              <p><strong>Cédula:</strong> {{ selectedOrder.customer_cedula }}</p>
            </div>

            <div class="detail-section">
              <h3>Dirección de envío</h3>
              <p>{{ selectedOrder.shipping_address }}</p>
              <p v-if="selectedOrder.shipping_address_extra">{{ selectedOrder.shipping_address_extra }}</p>
              <p>{{ selectedOrder.shipping_city }}, {{ selectedOrder.shipping_department }}</p>
              <p v-if="selectedOrder.shipping_postal_code">CP: {{ selectedOrder.shipping_postal_code }}</p>
            </div>

            <div class="detail-section">
              <h3>Productos</h3>
              <div v-for="item in parseItems(selectedOrder.items)" :key="item.id" class="detail-item">
                <span>{{ item.name }} x{{ item.quantity }}</span>
                <span>{{ formatPrice(item.price * item.quantity) }}</span>
              </div>
            </div>

            <div class="detail-section">
              <h3>Resumen</h3>
              <p><strong>Subtotal:</strong> {{ formatPrice(selectedOrder.subtotal) }}</p>
              <p v-if="selectedOrder.discount_amount > 0"><strong>Descuento:</strong> -{{ formatPrice(selectedOrder.discount_amount) }}</p>
              <p><strong>Envío:</strong> {{ formatPrice(selectedOrder.shipping_cost) }}</p>
              <p class="detail-total"><strong>Total:</strong> {{ formatPrice(selectedOrder.total) }}</p>
            </div>

            <div class="detail-section">
              <h3>Pago</h3>
              <p><strong>Estado:</strong> <span class="badge" :class="'badge-' + selectedOrder.payment_status">{{ paymentLabel(selectedOrder.payment_status) }}</span></p>
              <p v-if="selectedOrder.epayco_ref"><strong>Ref ePayco:</strong> {{ selectedOrder.epayco_ref }}</p>
              <p v-if="selectedOrder.payment_method"><strong>Método:</strong> {{ selectedOrder.payment_method }}</p>
            </div>

            <div class="detail-section">
              <h3>Envío</h3>
              <p><strong>Estado:</strong> <span class="badge" :class="'badge-' + selectedOrder.status">{{ statusLabel(selectedOrder.status) }}</span></p>
              <p v-if="selectedOrder.tracking_number"><strong>Guía:</strong> {{ selectedOrder.tracking_number }}</p>
              <p v-if="selectedOrder.shipping_carrier"><strong>Transportadora:</strong> {{ selectedOrder.shipping_carrier }}</p>
            </div>

            <div class="detail-actions">
              <a :href="'https://wa.me/57' + cleanPhone(selectedOrder.customer_phone) + '?text=Hola ' + selectedOrder.customer_first_name + ', tu pedido de Fortuna Natural está siendo procesado.'" target="_blank" class="btn-whatsapp">
                📱 WhatsApp al cliente
              </a>
              <a :href="'mailto:' + selectedOrder.customer_email" class="btn-email">
                ✉️ Email al cliente
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const authenticated = ref(false)
const password = ref('')
const loginError = ref('')
const orders = ref([])
const loading = ref(false)
const error = ref('')
const filterStatus = ref('all')
const selectedOrder = ref(null)

let adminToken = ''

function login() {
  adminToken = password.value
  loginError.value = ''
  fetchOrders()
}

function logout() {
  authenticated.value = false
  password.value = ''
  adminToken = ''
  orders.value = []
}

async function fetchOrders() {
  loading.value = true
  error.value = ''

  try {
    const params = new URLSearchParams()
    if (filterStatus.value !== 'all') params.set('status', filterStatus.value)
    params.set('limit', '100')

    const res = await fetch(`/api/get-orders?${params}`, {
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    })

    if (res.status === 401) {
      loginError.value = 'Contraseña incorrecta'
      authenticated.value = false
      return
    }

    const data = await res.json()

    if (data.orders) {
      orders.value = data.orders
      authenticated.value = true
    } else {
      error.value = data.error || 'Error cargando pedidos'
    }
  } catch (err) {
    error.value = 'Error de conexión'
    console.error(err)
  } finally {
    loading.value = false
  }
}

function ordersByStatus(status) {
  return orders.value.filter(o => o.status === status).length
}

function selectOrder(order) {
  selectedOrder.value = order
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function formatPrice(amount) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(amount)
}

function formatItems(items) {
  const parsed = typeof items === 'string' ? JSON.parse(items) : items
  if (!parsed || parsed.length === 0) return '-'
  return parsed.map(i => `${i.name} x${i.quantity}`).join(', ')
}

function parseItems(items) {
  return typeof items === 'string' ? JSON.parse(items) : items || []
}

function statusLabel(status) {
  const labels = {
    pending: 'Pendiente',
    paid: 'Pagado',
    shipped: 'Enviado',
    delivered: 'Entregado',
    cancelled: 'Cancelado'
  }
  return labels[status] || status
}

function paymentLabel(status) {
  const labels = {
    pending: 'Pendiente',
    approved: 'Aprobado',
    rejected: 'Rechazado',
    failed: 'Fallido'
  }
  return labels[status] || status
}

function cleanPhone(phone) {
  if (!phone) return ''
  return phone.replace(/\D/g, '')
}
</script>

<style scoped>
.admin-page {
  min-height: 100vh;
  background: #f5f5f5;
  font-family: var(--font-body, 'Inter', system-ui, sans-serif);
}

/* Login */
.admin-login {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 1rem;
}

.login-card {
  background: #fff;
  border-radius: 12px;
  padding: 3rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  text-align: center;
  max-width: 400px;
  width: 100%;
}

.login-card h1 {
  font-size: 1.5rem;
  margin-bottom: 0.25rem;
  color: #1a3c2a;
}

.login-card h2 {
  font-size: 1rem;
  font-weight: 400;
  color: #666;
  margin-bottom: 2rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.login-form input {
  padding: 0.75rem 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  text-align: center;
}

.login-form button {
  padding: 0.75rem;
  background: #1a3c2a;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
}

.login-form button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.login-error {
  color: #e53e3e;
  font-size: 0.875rem;
}

/* Header */
.admin-header {
  background: #1a3c2a;
  color: #fff;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.admin-header h1 {
  font-size: 1.25rem;
}

.admin-header-right {
  display: flex;
  gap: 0.5rem;
}

.btn-refresh, .btn-logout {
  padding: 0.5rem 1rem;
  border: 1px solid rgba(255,255,255,0.3);
  background: transparent;
  color: #fff;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
}

.btn-logout:hover { background: rgba(255,255,255,0.1); }

/* Stats */
.admin-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  padding: 1.5rem 2rem;
}

.stat-card {
  background: #fff;
  border-radius: 10px;
  padding: 1.25rem;
  text-align: center;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
}

.stat-number {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  color: #1a3c2a;
}

.stat-label {
  font-size: 0.8rem;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-pending .stat-number { color: #d69e2e; }
.stat-paid .stat-number { color: #38a169; }
.stat-shipped .stat-number { color: #3182ce; }

/* Filters */
.admin-filters {
  padding: 0 2rem;
  margin-bottom: 1rem;
}

.admin-filters select {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.9rem;
  background: #fff;
}

/* Table */
.admin-table-wrap {
  padding: 0 2rem 2rem;
  overflow-x: auto;
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
}

.admin-table th {
  background: #f8f8f8;
  padding: 0.75rem 1rem;
  text-align: left;
  font-size: 0.8rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  border-bottom: 1px solid #eee;
}

.admin-table td {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #f0f0f0;
  font-size: 0.9rem;
}

.admin-table tbody tr {
  cursor: pointer;
  transition: background 0.15s;
}

.admin-table tbody tr:hover {
  background: #f9fafb;
}

.td-total {
  font-weight: 600;
}

/* Badges */
.badge {
  display: inline-block;
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
}

.badge-pending { background: #fef3c7; color: #92400e; }
.badge-paid, .badge-approved { background: #d1fae5; color: #065f46; }
.badge-shipped { background: #dbeafe; color: #1e40af; }
.badge-delivered { background: #d1fae5; color: #065f46; }
.badge-cancelled, .badge-rejected, .badge-failed { background: #fee2e2; color: #991b1b; }

/* Btn detail */
.btn-detail {
  padding: 0.3rem 0.75rem;
  background: #1a3c2a;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 0.8rem;
  cursor: pointer;
}

/* Loading / Empty / Error */
.admin-loading, .admin-empty {
  text-align: center;
  padding: 3rem;
  color: #888;
  font-size: 1rem;
}

.admin-error {
  text-align: center;
  padding: 1rem;
  color: #e53e3e;
  background: #fee;
  margin: 0 2rem;
  border-radius: 8px;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: #fff;
  border-radius: 12px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #eee;
}

.modal-header h2 {
  font-size: 1.1rem;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  color: #888;
}

.modal-body {
  padding: 1.5rem;
}

.detail-section {
  margin-bottom: 1.5rem;
}

.detail-section h3 {
  font-size: 0.85rem;
  text-transform: uppercase;
  color: #888;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
  padding-bottom: 0.3rem;
  border-bottom: 1px solid #f0f0f0;
}

.detail-section p {
  margin: 0.25rem 0;
  font-size: 0.95rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  padding: 0.3rem 0;
  font-size: 0.95rem;
}

.detail-total {
  font-size: 1.1rem;
  margin-top: 0.5rem;
}

.detail-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.btn-whatsapp, .btn-email {
  flex: 1;
  padding: 0.75rem;
  text-align: center;
  border-radius: 8px;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
}

.btn-whatsapp {
  background: #25d366;
  color: #fff;
}

.btn-email {
  background: #f0f0f0;
  color: #333;
}

/* Responsive */
@media (max-width: 768px) {
  .admin-stats {
    grid-template-columns: repeat(2, 1fr);
  }

  .admin-header {
    flex-direction: column;
    gap: 0.5rem;
  }

  .admin-table-wrap {
    padding: 0 1rem 1rem;
  }

  .admin-filters {
    padding: 0 1rem;
  }
}
</style>