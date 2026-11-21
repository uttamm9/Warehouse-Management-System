Design a **complete enterprise SaaS product UI/UX prototype** for a **Warehouse Storage Management System (WSMS)** used in an automated warehouse with conveyor systems, rack storage, and QR/barcode inventory tracking.

The prototype should look like a **modern industrial SaaS platform** and must be **highly visual, responsive, and optimized for both desktop dashboards and industrial HMI touch screens**.

The output should include **full product screens, responsive layouts, reusable components, and clickable prototype flows**.

---

SYSTEM CONTEXT

This system manages automated warehouse storage operations based on the provided warehouse layout drawing.

Warehouse layout:

* Existing Shed - 1
* Existing Shed - 2

Additional areas:

* Cabin Room
* Strong Room
* Store Rooms
* DGR area
* Entry points
* Ramp

---

RACK CONFIGURATION (AS PER DRAWING)

Heavy Duty Racking System:

* Total racks: 40 racks

  * Main Unit: 9 racks
  * Add-On Unit: 31 racks

Rack specifications:

* Height: 2500 mm
* Length: 1500 mm
* Depth: 450 mm
* Levels: 5 levels per rack
* Load capacity: 300 kg per level

Additional racks in Cabin Room:

* Height: 2500 mm
* Length: 900 mm
* Depth: 450 mm
* Load capacity: 200 kg per level
* Total: 5 racks (1 main + 4 add-on)

---

SYSTEM INTEGRATION

The system integrates with:

* PLC controllers
* Conveyor systems
* HMI touch panels
* Wired barcode/QR scanners
* Warehouse Management System (WMS)

---

OVERALL PRODUCT STRUCTURE

Create a SaaS-style layout with:

Top Navigation Bar
Left Sidebar Navigation
Main Workspace Area
Notification System
Status Indicators

Sidebar menu:

Dashboard
Warehouse Layout
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

Create a real-time operations dashboard.

Top metrics:

Total SKUs
Total Inventory
Available Space
Occupied Space

Operational status:

PLC Status
Conveyor Status
Scanner Status

Graphs:

Rack utilization
Inbound vs outbound activity

Live activity feed:

Recent scans
Recent placements
Recent dispatches

---

WAREHOUSE VISUALIZATION (LAYOUT BASED)

Design a warehouse layout screen based on drawing.

Display:

* Existing Shed - 1
* Existing Shed - 2
* Cabin Room
* Strong Room
* Store Rooms
* DGR area
* Entry points
* Ramp

Display rack arrangement using:

* Main - A racks
* Add - B racks

Each rack should be clickable.

---

RACK MONITORING INTERFACE

Display racks in layout/grid format.

Each rack shows:

Rack type (Main / Add-on)
Levels (5 levels per rack)

Each level shows:

Green → empty
Yellow → partially used
Red → full

Clicking a level shows:

SKU
Quantity
Load

---

INBOUND INVENTORY SCREEN

Workflow:

Scan QR / barcode

Display:

SKU
Product details

Assign rack and level

Confirm placement

Update rack space

---

OUTBOUND INVENTORY SCREEN

Workflow:

Scan product

Display:

SKU
Rack location
Quantity

Confirm removal

Update inventory
Update space

---

SKU MANAGEMENT SYSTEM

Table with:

SKU ID
Product name
Category
Dimensions
Weight
Rack assignment
Stock level

Actions:

Add
Edit
Delete
Generate QR

---

CONVEYOR CONTROL PANEL

Controls:

Start
Stop
Emergency stop

Routing:

Select rack
Select level

Status:

PLC connected
Conveyor running
Scanner active

---

REPORTING MODULE

Reports:

Inbound
Outbound
Stock status
Rack utilization

Filters:

Date
SKU
Rack

Export:

PDF
CSV
Excel

---

BILLING SYSTEM

Generate invoices based on:

SKU
Storage
Weight

Invoice includes:

SKU details
Rack history
Charges
Total

Payment status:

Pending
Paid

---

SYSTEM LOGS

Display logs for:

Scan activity
Rack updates
System actions

Columns:

Time
User
Action
Status

---

REAL-TIME STATUS UI

Display real-time updates for:

Rack occupancy
Scanner activity
Conveyor status
PLC connection

---

DESIGN STYLE

Modern industrial dashboard:

Dark theme
Clear typography
Color indicators

Green → available
Yellow → partial
Red → full
Blue → controls

---

RESPONSIVE DESIGN

Design for:

Desktop
Laptop
Tablet
HMI touch panels

Ensure large touch-friendly UI elements.

---

PROTOTYPE INTERACTIONS

Clickable flows:

Login → Dashboard
Dashboard → Warehouse Layout
Warehouse Layout → Rack Details
Inbound → Placement
Outbound → Removal
Billing → Invoice

---

DESIGN SYSTEM

Reusable components:

Buttons
Tables
Rack cards
Forms
Charts
Modals

Include spacing, typography, and color system.

---

The final output should represent a **complete warehouse system UI prototype aligned with the provided layout drawing and system requirements**.