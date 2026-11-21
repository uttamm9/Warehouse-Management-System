Design a **complete enterprise SaaS product UI/UX prototype** for a **Warehouse Storage Management System (WSMS)** used in automated warehouses with conveyor systems, rack storage, and QR/barcode inventory tracking.

The prototype should look like a **modern industrial SaaS platform similar to Tesla industrial dashboards, AWS console, or modern logistics platforms**.

The UI must be **highly visual, responsive, and optimized for both desktop dashboards and industrial HMI touch screens**.

The output should include **full product screens, responsive layouts, reusable components, and clickable prototype flows**.

---

SYSTEM CONTEXT

This system manages automated warehouse storage operations.

Warehouse layout:

Room 1

* Size: 41 ft × 45 ft
* 10 racks

Room 2

* Size: 61 ft × 26 ft
* 10 racks

Rack configuration:

* Total racks: 20
* Each rack has 4 shelves
* Shelf labels: A, B, C, D
* Total storage positions: 80

Shelf capacity:

* 100 kg per shelf
* Width: 900–1500 mm
* Depth: 450 mm
* Rack height: 2100–2400 mm

The system integrates with:

* PLC controllers
* Conveyor belts
* HMI touch panels
* QR/barcode scanners
* Warehouse Management System (WMS)

The software controls product movement, rack placement, SKU tracking, reporting, and billing.

---

OVERALL PRODUCT STRUCTURE

Create a **SaaS-style web application layout** with:

Top Navigation Bar
Left Sidebar Navigation
Main Workspace Area
Notification System
Status Indicators

Sidebar menu:

Dashboard
Warehouse Map
Rack Monitoring
Inbound Inventory
Outbound Inventory
SKU Management
Conveyor Control
Reports
Billing
System Logs
Settings

---

DASHBOARD DESIGN

Create a **real-time warehouse operations dashboard**.

Top metrics cards:

Total SKUs
Total Inventory Units
Available Shelf Positions
Occupied Shelf Positions

Operational status cards:

PLC Status
Conveyor Status
Scanner Status
System Health

Graphs:

Rack Utilization Chart
Inbound vs Outbound Activity Chart
Daily Warehouse Activity Timeline

Live activity feed:

Recent QR scans
Recent rack placements
Recent outbound dispatches

---

WAREHOUSE VISUALIZATION (3D/ISOMETRIC VIEW)

Design a **visual warehouse map screen**.

Use **isometric or semi-3D visualization** to display:

Room 1 racks
Room 2 racks
Conveyor routes

Each rack should be clickable.

Each rack displays shelf indicators:

Green → empty
Yellow → partially used
Red → full

Clicking a rack opens a **rack detail panel** showing:

Rack number
Shelf A–D status
Stored SKU
Quantity
Capacity remaining

Include a **mini warehouse map navigator**.

---

RACK MONITORING INTERFACE

Create a **rack management screen**.

Display racks in a **grid layout representing warehouse layout**.

Each rack card shows:

Rack number
Shelf A status
Shelf B status
Shelf C status
Shelf D status

Color indicators for shelf occupancy.

Clicking a shelf reveals:

SKU stored
Product name
Quantity
Weight stored

Include filters:

Room filter
Rack filter
SKU filter
Shelf status filter

---

INBOUND INVENTORY SCREEN

Design a workflow interface for receiving products.

Main elements:

QR / Barcode scanner input field

Product details panel:

SKU
Product name
Category
Dimensions
Weight

System suggested storage location:

Rack number
Shelf level

Buttons:

Assign rack
Confirm placement
Print QR label

Display conveyor routing confirmation.

Show animated confirmation once product is stored.

---

OUTBOUND INVENTORY SCREEN

Create dispatch workflow.

Operator scans product QR code.

Display:

Order ID
SKU
Product name
Rack location
Quantity

Buttons:

Confirm removal
Cancel

After confirmation:

Update rack space
Update inventory
Trigger billing

Show success confirmation message.

---

SKU MANAGEMENT SYSTEM

Design a product database interface.

Table columns:

SKU ID
Product Name
Category
Weight
Dimensions
Preferred Rack
Current Stock
Reorder Threshold

Buttons:

Add SKU
Edit SKU
Delete SKU
Generate QR Code

Add SKU form fields:

Product name
Description
Category
Dimensions
Weight
Rack preference
Reorder threshold

---

CONVEYOR CONTROL PANEL

Create an **industrial control interface**.

Controls include:

Start conveyor
Stop conveyor
Emergency stop

Routing configuration:

Select rack destination
Select shelf

Display system indicators:

PLC connected
Conveyor active
Scanner online

Include industrial style status lights.

---

REPORTING DASHBOARD

Create reporting screens with charts and tables.

Reports required:

Inbound inventory report
Outbound inventory report
Stock status report
Rack utilization report

Filters:

Date range
SKU
Rack
Room

Export buttons:

PDF
CSV
Excel

Charts include:

Warehouse utilization
SKU distribution
Inventory trends

---

BILLING SYSTEM

Create a warehouse billing interface.

Invoice screen includes:

Invoice number
Order ID
SKU details
Storage duration
Weight charges
Total amount

Buttons:

Generate invoice
Export invoice
Mark payment paid

Payment status:

Pending
Paid

Include billing analytics dashboard.

---

SYSTEM LOGS

Design an audit log screen.

Columns:

Timestamp
User
Action
Item
Status

Filters:

Date
User
Module

---

REAL-TIME STATUS UI

Include dynamic indicators for:

Scanner activity
Rack occupancy
Conveyor movement
PLC connection

Use glowing indicators and animations.

---

DESIGN STYLE

Use a **modern industrial SaaS design**.

Visual style inspiration:

Tesla industrial dashboards
AWS console
Modern logistics platforms

Design elements:

Dark theme dashboard
Glassmorphism cards
Soft shadows
Large readable typography
Clear color-coded indicators

Color coding:

Green → available
Yellow → warning
Red → full or error
Blue → system controls

Use card-based layout.

---

RESPONSIVE DESIGN

Create responsive layouts for:

Desktop dashboard (1920px)
Laptop screens (1440px)
Tablet interface (1024px)
Industrial HMI touchscreen panels

Ensure large touch-friendly controls.

---

PROTOTYPE INTERACTIONS

Create clickable prototype flows:

Login → Dashboard
Dashboard → Warehouse Map
Warehouse Map → Rack Details
Inbound Scan → Rack Assignment
Outbound Scan → Inventory Update
Invoice Generation Flow

Include micro-interactions for:

Scan confirmation
Rack placement
Conveyor routing
Invoice generation

---

DESIGN SYSTEM

Create reusable components:

Buttons
Status indicators
Rack cards
Inventory tables
Charts
Forms
Modals

Include spacing system, typography scale, and color tokens.

---

The final result should look like a **complete enterprise warehouse management SaaS platform ready for development**, with polished UI, modern dashboard layout, warehouse visualization, and full responsive design.
