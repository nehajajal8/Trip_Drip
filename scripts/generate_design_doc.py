"""
scripts/generate_design_doc.py
Generates the comprehensive Trip Drip System Design & UI/UX Architecture Specification (.docx).
Includes extensive UI/UX design tokens, screen-by-screen layout breakdowns, screenshot placeholder frames,
and third-party apps, services, and websites used.
"""

import os
import shutil
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import parse_xml, OxmlElement
from docx.oxml.ns import nsdecls, qn

# --- Color Palette Constants ---
HEX_PRIMARY_DARK = "1E3A8A"    # Deep Navy
HEX_PRIMARY_BLUE = "2563EB"    # Royal Blue
HEX_SECONDARY_TEAL = "0D9488"  # Dark Teal
HEX_TEXT_DARK = "1F2937"       # Charcoal
HEX_TEXT_MUTED = "4B5563"      # Slate Gray
HEX_BG_LIGHT = "F8FAFC"        # Light Slate Tint
HEX_BG_CALLOUT = "EFF6FF"      # Light Blue Tint
HEX_BORDER = "CBD5E1"          # Border Slate
HEX_ACCENT_AMBER = "D97706"    # Amber
HEX_BORDER_DASH = "94A3B8"     # Medium Slate for Screenshot Frames

COLOR_PRIMARY_DARK = RGBColor(30, 58, 138)
COLOR_PRIMARY_BLUE = RGBColor(37, 99, 235)
COLOR_SECONDARY_TEAL = RGBColor(13, 148, 136)
COLOR_TEXT_DARK = RGBColor(31, 41, 55)
COLOR_TEXT_MUTED = RGBColor(75, 85, 99)

def set_cell_background(cell, hex_color):
    """Sets background color for a table cell."""
    tc_pr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{hex_color}"/>')
    tc_pr.append(shd)

def set_cell_margins(cell, top=120, bottom=120, left=150, right=150):
    """Sets inner margins (padding) in dxa (1 pt = 20 dxa)."""
    tc_pr = cell._tc.get_or_add_tcPr()
    tc_mar = parse_xml(f'<w:tcMar {nsdecls("w")}><w:top w:w="{top}" w:type="dxa"/><w:bottom w:w="{bottom}" w:type="dxa"/><w:left w:w="{left}" w:type="dxa"/><w:right w:w="{right}" w:type="dxa"/></w:tcMar>')
    tc_pr.append(tc_mar)

def set_cell_borders(cell, top="CBD5E1", bottom="CBD5E1", left=None, right=None, sz="4", val="single"):
    """Sets borders on a cell."""
    tc_pr = cell._tc.get_or_add_tcPr()
    borders_xml = f'<w:tcBorders {nsdecls("w")}>'
    borders_xml += f'<w:top w:val="{val}" w:sz="{sz}" w:space="0" w:color="{top}"/>' if top else '<w:top w:val="none"/>'
    borders_xml += f'<w:bottom w:val="{val}" w:sz="{sz}" w:space="0" w:color="{bottom}"/>' if bottom else '<w:bottom w:val="none"/>'
    borders_xml += f'<w:left w:val="{val}" w:sz="{sz}" w:space="0" w:color="{left}"/>' if left else '<w:left w:val="none"/>'
    borders_xml += f'<w:right w:val="{val}" w:sz="{sz}" w:space="0" w:color="{right}"/>' if right else '<w:right w:val="none"/>'
    borders_xml += '</w:tcBorders>'
    tc_pr.append(parse_xml(borders_xml))

def format_table(table, col_widths=None, header_bg=HEX_PRIMARY_DARK):
    """Styles a standard data table with headers, borders, and alternating rows."""
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    for i, row in enumerate(table.rows):
        is_header = (i == 0)
        bg_color = header_bg if is_header else (HEX_BG_LIGHT if i % 2 == 1 else "FFFFFF")
        for j, cell in enumerate(row.cells):
            set_cell_background(cell, bg_color)
            set_cell_margins(cell, top=130, bottom=130, left=150, right=150)
            set_cell_borders(cell, top=HEX_BORDER, bottom=HEX_BORDER, sz="6" if is_header else "4")
            if col_widths and j < len(col_widths):
                cell.width = col_widths[j]
            for p in cell.paragraphs:
                p.paragraph_format.space_before = Pt(2)
                p.paragraph_format.space_after = Pt(2)
                p.paragraph_format.line_spacing = 1.15
                for run in p.runs:
                    if is_header:
                        run.font.bold = True
                        run.font.color.rgb = RGBColor(255, 255, 255)
                        run.font.size = Pt(10)
                    else:
                        run.font.size = Pt(9.5)
                        run.font.color.rgb = COLOR_TEXT_DARK

def add_heading_1(doc, text):
    """Adds a primary level-1 section heading."""
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(18)
    p.paragraph_format.space_after = Pt(6)
    p.paragraph_format.keep_with_next = True
    run = p.add_run(text)
    run.font.name = "Calibri"
    run.font.size = Pt(16)
    run.font.bold = True
    run.font.color.rgb = COLOR_PRIMARY_DARK
    p_pr = p._p.get_or_add_pPr()
    pBdr = parse_xml(f'<w:pBdr {nsdecls("w")}><w:bottom w:val="single" w:sz="12" w:space="4" w:color="{HEX_PRIMARY_BLUE}"/></w:pBdr>')
    p_pr.append(pBdr)
    return p

def add_heading_2(doc, text):
    """Adds a level-2 sub-heading."""
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(14)
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.keep_with_next = True
    run = p.add_run(text)
    run.font.name = "Calibri"
    run.font.size = Pt(13)
    run.font.bold = True
    run.font.color.rgb = COLOR_PRIMARY_BLUE
    return p

def add_heading_3(doc, text):
    """Adds a level-3 sub-heading."""
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(10)
    p.paragraph_format.space_after = Pt(3)
    p.paragraph_format.keep_with_next = True
    run = p.add_run(text)
    run.font.name = "Calibri"
    run.font.size = Pt(11)
    run.font.bold = True
    run.font.color.rgb = COLOR_SECONDARY_TEAL
    return p

def add_paragraph(doc, text, bold_prefix="", italic_prefix=""):
    """Adds a styled body paragraph."""
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(5)
    p.paragraph_format.line_spacing = 1.15
    if bold_prefix:
        r_pre = p.add_run(bold_prefix)
        r_pre.font.name = "Calibri"
        r_pre.font.size = Pt(10)
        r_pre.font.bold = True
        r_pre.font.color.rgb = COLOR_TEXT_DARK
    if italic_prefix:
        r_it = p.add_run(italic_prefix)
        r_it.font.name = "Calibri"
        r_it.font.size = Pt(10)
        r_it.font.italic = True
        r_it.font.color.rgb = COLOR_TEXT_MUTED
    r_body = p.add_run(text)
    r_body.font.name = "Calibri"
    r_body.font.size = Pt(10)
    r_body.font.color.rgb = COLOR_TEXT_DARK
    return p

def add_bullet(doc, bold_title, text):
    """Adds a styled bullet item."""
    p = doc.add_paragraph(style='List Bullet')
    p.paragraph_format.space_before = Pt(1)
    p.paragraph_format.space_after = Pt(3)
    p.paragraph_format.line_spacing = 1.15
    r_bold = p.add_run(bold_title + ": ")
    r_bold.font.name = "Calibri"
    r_bold.font.size = Pt(10)
    r_bold.font.bold = True
    r_bold.font.color.rgb = COLOR_TEXT_DARK
    r_body = p.add_run(text)
    r_body.font.name = "Calibri"
    r_body.font.size = Pt(10)
    r_body.font.color.rgb = COLOR_TEXT_DARK
    return p

def add_callout(doc, title, text, callout_type="NOTE"):
    """Adds a shaded callout box with colored left border."""
    border_color = HEX_PRIMARY_BLUE
    bg_color = HEX_BG_CALLOUT
    if callout_type == "IMPORTANT":
        border_color = HEX_ACCENT_AMBER
        bg_color = "FFFBEB"
    elif callout_type == "TIP":
        border_color = HEX_SECONDARY_TEAL
        bg_color = "F0FDF4"

    table = doc.add_table(rows=1, cols=1)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    cell = table.rows[0].cells[0]
    cell.width = Inches(6.8)
    set_cell_background(cell, bg_color)
    set_cell_margins(cell, top=140, bottom=140, left=200, right=180)
    set_cell_borders(cell, top=None, bottom=None, left=border_color, right=None, sz="24")

    p = cell.paragraphs[0]
    p.paragraph_format.space_before = Pt(2)
    p.paragraph_format.space_after = Pt(2)
    p.paragraph_format.line_spacing = 1.15

    r_icon = p.add_run(f"[{callout_type}] {title}: ")
    r_icon.font.name = "Calibri"
    r_icon.font.size = Pt(10)
    r_icon.font.bold = True
    r_icon.font.color.rgb = COLOR_PRIMARY_DARK if callout_type != "IMPORTANT" else RGBColor(180, 83, 9)

    r_text = p.add_run(text)
    r_text.font.name = "Calibri"
    r_text.font.size = Pt(9.5)
    r_text.font.color.rgb = COLOR_TEXT_DARK

    doc.add_paragraph().paragraph_format.space_after = Pt(4)

def add_screenshot_placeholder(doc, caption, screen_name, instructions):
    """Adds a dedicated screenshot placeholder frame for users to paste UI screenshots."""
    table = doc.add_table(rows=1, cols=1)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    cell = table.rows[0].cells[0]
    cell.width = Inches(6.8)
    set_cell_background(cell, "F8FAFC")
    set_cell_margins(cell, top=260, bottom=260, left=220, right=220)
    set_cell_borders(cell, top=HEX_BORDER_DASH, bottom=HEX_BORDER_DASH, left=HEX_BORDER_DASH, right=HEX_BORDER_DASH, sz="12", val="dashed")

    p = cell.paragraphs[0]
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(4)
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.line_spacing = 1.15

    r1 = p.add_run("📷 [UI SCREENSHOT PLACEHOLDER]\n")
    r1.font.name = "Calibri"
    r1.font.size = Pt(11)
    r1.font.bold = True
    r1.font.color.rgb = COLOR_PRIMARY_BLUE

    r2 = p.add_run(f"Screen: {screen_name} — {caption}\n")
    r2.font.name = "Calibri"
    r2.font.size = Pt(10)
    r2.font.bold = True
    r2.font.color.rgb = COLOR_TEXT_DARK

    r3 = p.add_run(f"Action: {instructions}\n(To insert: Click here, press Ctrl+V or click Insert > Pictures)")
    r3.font.name = "Calibri"
    r3.font.size = Pt(8.5)
    r3.font.italic = True
    r3.font.color.rgb = COLOR_TEXT_MUTED

    doc.add_paragraph().paragraph_format.space_after = Pt(6)

def build_design_document(output_path):
    print(f"Generating Comprehensive System & UI/UX Design Document: {output_path}...")
    doc = Document()

    # --- Page Setup ---
    section = doc.sections[0]
    section.top_margin = Inches(0.75)
    section.bottom_margin = Inches(0.75)
    section.left_margin = Inches(0.8)
    section.right_margin = Inches(0.8)
    section.page_width = Inches(8.5)
    section.page_height = Inches(11.0)

    # --- Header & Footer ---
    footer = section.footer
    f_p = footer.paragraphs[0]
    f_p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    f_run = f_p.add_run("Trip Drip (India Edition) — System & UI/UX Design Specification | Confidential")
    f_run.font.name = "Calibri"
    f_run.font.size = Pt(8.5)
    f_run.font.color.rgb = COLOR_TEXT_MUTED

    # --- Title Banner ---
    title_p = doc.add_paragraph()
    title_p.paragraph_format.space_before = Pt(10)
    title_p.paragraph_format.space_after = Pt(2)
    t_run = title_p.add_run("TRIP DRIP — SYSTEM DESIGN & UI/UX SPECIFICATION")
    t_run.font.name = "Calibri"
    t_run.font.size = Pt(22)
    t_run.font.bold = True
    t_run.font.color.rgb = COLOR_PRIMARY_DARK

    sub_p = doc.add_paragraph()
    sub_p.paragraph_format.space_before = Pt(0)
    sub_p.paragraph_format.space_after = Pt(14)
    s_run = sub_p.add_run("Comprehensive Software Architecture, UI/UX Design System, Screen Layouts & Third-Party Integrations (India Edition v2.4)")
    s_run.font.name = "Calibri"
    s_run.font.size = Pt(12)
    s_run.font.italic = True
    s_run.font.color.rgb = COLOR_PRIMARY_BLUE

    # --- Metadata Table ---
    meta_table = doc.add_table(rows=6, cols=2)
    meta_data = [
        ("Document Identifier", "DD-TD-2026-UIUX-V2.4"),
        ("Project / Product Name", "Trip Drip (India Transit Edition & Global Travel Companion)"),
        ("Document Scope", "System Architecture, UI/UX Design Tokens, Wireframes, Screen Layouts, Screenshot Specs"),
        ("Author & Engineering Lead", "Lead UI/UX Architect & Antigravity Engineering Pair"),
        ("Design System Stack", "Tailwind CSS v3, React 18, Lucide React, Leaflet Maps, Glassmorphism UI"),
        ("Release State", "Approved Baseline — Ready for UI Screenshot Insertion & Engineering Reference")
    ]
    for idx, (label, val) in enumerate(meta_data):
        row = meta_table.rows[idx]
        row.cells[0].paragraphs[0].add_run(label).font.bold = True
        row.cells[1].paragraphs[0].add_run(val)
    format_table(meta_table, col_widths=[Inches(2.3), Inches(4.5)], header_bg=HEX_PRIMARY_DARK)

    doc.add_paragraph().paragraph_format.space_after = Pt(10)

    # ─────────────────────────────────────────────────────────────────
    # SECTION 1: EXECUTIVE SUMMARY & PRODUCT VISION
    # ─────────────────────────────────────────────────────────────────
    add_heading_1(doc, "1. Executive Summary & Product Vision")
    add_paragraph(doc, "Trip Drip is a full-stack AI travel operating system and intelligent wardrobe companion engineered specifically for modern travelers. The platform unifies trip planning, packing optimization, transit gastronomy, group financial resolution, and retail discovery into an intuitive, responsive interface.")

    add_heading_2(doc, "1.1 Core Problems Solved")
    add_bullet(doc, "Fragmented Travel Planning", "Travelers juggle separate apps for train tickets, weather checks, budgeting, and packing lists. Trip Drip integrates all dimensions into a unified, trip-scoped cockpit.")
    add_bullet(doc, "Transit & Food Information Asymmetry", "Key Indian transit corridors lack verified information on platform culinary icons and clean water. The Chai & Station Radar bridges this gap.")
    add_bullet(doc, "Group Cashflow Disputes", "Group trips suffer from messy multi-person expenses. Trip Drip solves this with automated minimal cashflow resolution and instant UPI QR generation.")
    add_bullet(doc, "Climate-Wardrobe Mismatch", "Sudden weather changes ruin trips. The AI Wardrobe analyzes clothing photos and destination climate to generate daily outfit recommendations.")

    # ─────────────────────────────────────────────────────────────────
    # SECTION 2: UI/UX DESIGN SYSTEM & VISUAL IDENTITY
    # ─────────────────────────────────────────────────────────────────
    add_heading_1(doc, "2. UI/UX Design System & Visual Identity")
    add_paragraph(doc, "Trip Drip utilizes a tailored, modern design system built on top of Tailwind CSS. The design language emphasizes high legibility, travel warmth, glassmorphism overlays, and mobile-first ergonomics.")

    add_heading_2(doc, "2.1 Color Palette & Semantic Tokens")
    color_table = doc.add_table(rows=7, cols=4)
    color_headers = ["Color Role", "Hex Code", "Tailwind Class", "Visual Purpose & Usage"]
    for j, h in enumerate(color_headers):
        color_table.rows[0].cells[j].paragraphs[0].add_run(h)

    palette = [
        ("Primary Brand", "#1E3A8A / #2563EB", "blue-900 / blue-600", "Headers, active navigation tabs, action buttons, primary badges."),
        ("Accent Teal", "#0D9488 / #14B8A6", "teal-700 / teal-500", "Station radar badges, Rail Neer verified highlights, success states."),
        ("Warm Amber", "#D97706 / #F59E0B", "amber-600 / amber-500", "Chai tapri highlights, weather temperature badges, budget alerts."),
        ("Dark Background", "#0F172A / #1E293B", "slate-900 / slate-800", "Landing page dark hero, navigation bars, modal backgrounds."),
        ("Surface Light", "#FFFFFF / #F8FAFC", "white / slate-50", "Card containers, form inputs, dashboard day schedule panels."),
        ("Text Hierarchy", "#0F172A / #64748B", "slate-900 / slate-500", "Primary text (slate-900), subtitles and secondary metadata (slate-500).")
    ]
    for idx, row_data in enumerate(palette):
        row = color_table.rows[idx + 1]
        for col_idx, val in enumerate(row_data):
            row.cells[col_idx].paragraphs[0].add_run(val)
    format_table(color_table, col_widths=[Inches(1.5), Inches(1.5), Inches(1.5), Inches(2.3)])

    add_heading_2(doc, "2.2 Typography Scale")
    add_paragraph(doc, "The application relies on clean system and sans-serif typography (Inter / -apple-system / BlinkMacSystemFont), prioritizing readability across desktop and small mobile screens:")
    add_bullet(doc, "Hero Titles (H1)", "text-3xl to text-5xl (30px to 48px), font-extrabold, tracking-tight.")
    add_bullet(doc, "Section Headers (H2)", "text-xl to text-2xl (20px to 24px), font-bold, text-slate-900.")
    add_bullet(doc, "Card Titles (H3)", "text-base to text-lg (16px to 18px), font-semibold.")
    add_bullet(doc, "Body Text", "text-sm to text-base (14px to 16px), line-height 1.5, text-slate-700.")
    add_bullet(doc, "Badges & Microcopy", "text-xs (12px), uppercase tracking-wider, font-medium.")

    add_heading_2(doc, "2.3 Component Design Principles")
    add_bullet(doc, "Mobile-First Ergonomics", "Critical touch targets (Chai Radar, Trip Concierge, Expense Entry) are sized at >= 44x44px and placed within thumb reach.")
    add_bullet(doc, "Glassmorphic Floating Overlays", "The AI Travel Butler (`TripConcierge`) floats persistently on bottom-right with subtle backdrop blur (`backdrop-blur-md bg-white/90`).")
    add_bullet(doc, "Micro-Interactions", "Cards feature smooth hover translation (`hover:-translate-y-1 transition duration-200`) and scale feedback on button clicks.")

    # ─────────────────────────────────────────────────────────────────
    # SECTION 3: SCREEN-BY-SCREEN UI WALKTHROUGH & SCREENSHOT FRAMES
    # ─────────────────────────────────────────────────────────────────
    add_heading_1(doc, "3. Screen-by-Screen UI Walkthrough & Screenshot Placeholders")
    add_paragraph(doc, "Below is the architectural walkthrough of every primary screen in Trip Drip, accompanied by designated screenshot placement frames. Capture each screen from your running app (http://localhost:5173) and paste it into the respective frame.")

    # Screen 1: Landing Page
    add_heading_2(doc, "3.1 Screen: Public Landing Page (`/`)")
    add_paragraph(doc, "Component: `src/pages/Landing.jsx`. Features a high-impact travel hero section, visual feature grid (Itinerary Engine, Chai Radar, Smart Wardrobe, Hisaab-Kitaab), interactive animated cards, and call-to-action buttons directing users to Signup/Login.")
    add_screenshot_placeholder(doc, "Hero Section & Product Feature Showcase", "Landing Page (/)", 
                               "Navigate to http://localhost:5173/ and capture the full hero banner with CTA buttons.")

    # Screen 2: Authentication
    add_heading_2(doc, "3.2 Screen: Authentication Pages (`/login` & `/signup`)")
    add_paragraph(doc, "Component: `src/pages/AuthPages.jsx`. Sleek centered card layout with tabbed toggle between Login and Signup, validation error feedback, and Supabase Auth integration.")
    add_screenshot_placeholder(doc, "User Login & Account Registration View", "Auth Page (/login)", 
                               "Navigate to http://localhost:5173/login and capture the centered authentication card.")

    # Screen 3: New Trip Wizard
    add_heading_2(doc, "3.3 Screen: 5-Step Trip Creation Wizard (`/trips/new`)")
    add_paragraph(doc, "Component: `src/pages/NewTrip.jsx`. Multi-step interactive wizard guiding travelers through Destination Selection, Calendar Date Picker, Total Budget in INR, Group Size & Squad Members, and Trip Style (Heritage, Beach, Mountain, Offbeat).")
    add_screenshot_placeholder(doc, "Trip Creation Wizard with Budget & Style Selection", "New Trip (/trips/new)", 
                               "Navigate to http://localhost:5173/trips/new and capture Step 1 or Step 2 of the wizard.")

    # Screen 4: Trip Dashboard
    add_heading_2(doc, "3.4 Screen: Master Trip Dashboard (`/trips/:id`)")
    add_paragraph(doc, "Component: `src/pages/TripDashboard.jsx`. Central command center rendering: Top Trip Stats Banner (destination, dates, remaining budget), Live Weather Summary Widget, Leaflet Interactive Map Viewport, Day-by-Day Itinerary Schedule with distinct route themes, and quick-action tool buttons.")
    add_screenshot_placeholder(doc, "Trip Dashboard with Itinerary Schedule & Weather Card", "Dashboard (/trips/:id)", 
                               "Open an active trip (e.g. Jaipur or Mumbai) and capture the top stats and Day-by-Day schedule.")

    # Screen 5: Hisaab-Kitaab
    add_heading_2(doc, "3.5 Screen: Hisaab-Kitaab Group Expense Splitter (`/trips/:id/expenses`)")
    add_paragraph(doc, "Component: `src/pages/Expenses.jsx`. Displays Total Group Spend, Per-Person Fair Share, Category Pie Breakdown, Minimal Settlement Cards (who pays whom), and the instant NPCI UPI QR Code modal for scan-to-pay.")
    add_screenshot_placeholder(doc, "Hisaab-Kitaab Debt Resolution & UPI QR Code", "Expenses (/trips/:id/expenses)", 
                               "Navigate to Expenses tab, log an expense, and capture the settlement cards and UPI QR modal.")

    # Screen 6: Chai & Station Radar
    add_heading_2(doc, "3.6 Screen: Chai & Station Radar Modal")
    add_paragraph(doc, "Component: `src/components/food/ChaiStationRadarModal.jsx`. Transit gastronomy modal displaying station corridors (CSMT, Lonavala, Old Delhi), iconic platform tapris, cutting chai varieties, local food prices, and Rail Neer verified water checkpoints.")
    add_screenshot_placeholder(doc, "Chai & Station Radar Modal with Transit Corridors", "Chai Radar Modal", 
                               "Click 'Chai & Station Radar' button on dashboard and capture the open modal with station tapris.")

    # Screen 7: Smart Wardrobe
    add_heading_2(doc, "3.7 Screen: Smart Wardrobe & Suitability Scoring (`/trips/:id/wardrobe`)")
    add_paragraph(doc, "Component: `src/pages/Wardrobe.jsx`. Garment grid displaying uploaded apparel items, automatic category and color tags, fabric breathability ratings, and climate suitability scores (0-10) calibrated against destination weather.")
    add_screenshot_placeholder(doc, "Wardrobe Grid with AI Weather Suitability Badges", "Wardrobe (/trips/:id/wardrobe)", 
                               "Navigate to Wardrobe tab and capture the garment grid showing suitability ratings.")

    # Screen 8: Cross-Brand Shop
    add_heading_2(doc, "3.8 Screen: Cross-Brand Fashion Comparison & Cart (`/trips/:id/shop`)")
    add_paragraph(doc, "Component: `src/pages/Shop.jsx`. 4-way brand benchmark comparing Zara, H&M, Uniqlo, and Westside. Displays price bands, fabric specs, 'In Budget' tags, and dynamic cart deduction.")
    add_screenshot_placeholder(doc, "4-Way Brand Comparison (Zara, H&M, Uniqlo, Westside)", "Shop (/trips/:id/shop)", 
                               "Navigate to Shop tab and capture the product cards comparing brand prices and specs.")

    # Screen 9: Travel Journal
    add_heading_2(doc, "3.9 Screen: Travel Journal & Memory Book (`/trips/:id/journal`)")
    add_paragraph(doc, "Component: `src/pages/Journal.jsx`. Date-indexed diary entries with travel reflections, photo attachments, geotags, and offline local sync.")
    add_screenshot_placeholder(doc, "Travel Journal Entries with Photo Attachments", "Journal (/trips/:id/journal)", 
                               "Navigate to Journal tab and capture a logged entry with photo and reflection text.")

    # Screen 10: AI Butler Concierge
    add_heading_2(doc, "3.10 Screen: AI Travel Butler Floating Concierge Overlay")
    add_paragraph(doc, "Component: `src/components/chat/TripConcierge.jsx`. Floating conversational assistant with prompt suggestions, live chat messages, and automatic action triggers (Add to Cart, Mark Packed, Settle Hisaab).")
    add_screenshot_placeholder(doc, "Floating AI Concierge Chat Drawer with Action Chips", "Trip Concierge Drawer", 
                               "Click floating chat bubble on bottom right and capture the expanded AI Concierge window.")

    # ─────────────────────────────────────────────────────────────────
    # SECTION 4: APPS, PLATFORMS, SERVICES & SITES USED
    # ─────────────────────────────────────────────────────────────────
    add_heading_1(doc, "4. Third-Party Applications, APIs & Online Services Used")
    add_paragraph(doc, "Trip Drip integrates with and relies on several external platforms, developer services, open-source mapping projects, and consumer ecosystems:")

    services_table = doc.add_table(rows=9, cols=4)
    serv_headers = ["Platform / Service", "Domain / URL", "Service Category", "Architectural Role & Integration Details"]
    for j, h in enumerate(serv_headers):
        services_table.rows[0].cells[j].paragraphs[0].add_run(h)

    services_data = [
        ("OpenStreetMap & Leaflet", "https://openstreetmap.org\nhttps://leafletjs.com", "Mapping & Geospatial", "Provides open-source map vector tiles, marker overlays, and station coordinate visualization with zero recurring API costs."),
        ("Supabase Cloud", "https://supabase.com", "Backend-as-a-Service (BaaS)", "Hosts PostgreSQL database, Row-Level Security (RLS) policies, JWT user authentication, and 'wardrobe' photo storage bucket."),
        ("pgvector Extension", "https://github.com/pgvector/pgvector", "Vector Database", "PostgreSQL extension for indexing and querying 1536-dimensional garment visual embeddings using cosine distance."),
        ("OpenAI API Platform", "https://platform.openai.com", "LLM Inference", "Powers conversational travel guidance in Trip Concierge using GPT-4o / GPT-4o-mini and LangChain prompts."),
        ("Hugging Face Inference", "https://huggingface.co", "Computer Vision ML", "Extracts apparel feature embeddings, color tags, and category classification from uploaded garment images."),
        ("NPCI UPI Ecosystem", "upi:// mobile deep link protocol", "Digital Payments", "Native UPI URI scheme enabling instant zero-fee group settlements via Google Pay, PhonePe, Paytm, and BHIM."),
        ("Fashion Retail Brands", "Zara, H&M, Uniqlo, Westside", "E-Commerce Benchmark", "Benchmark catalogs used for cross-brand pricing, fabric breathability, and travel wardrobe comparisons."),
        ("Screen Capture Tools", "Windows Snipping Tool (Win+Shift+S)", "Documentation Asset Tool", "Recommended utility for capturing clean, pixel-perfect screenshots of the running web application.")
    ]
    for idx, row_data in enumerate(services_data):
        row = services_table.rows[idx + 1]
        for col_idx, val in enumerate(row_data):
            row.cells[col_idx].paragraphs[0].add_run(val)
    format_table(services_table, col_widths=[Inches(1.5), Inches(1.5), Inches(1.4), Inches(2.4)])

    # ─────────────────────────────────────────────────────────────────
    # SECTION 5: DATA MODELS & RELATIONAL ARCHITECTURE
    # ─────────────────────────────────────────────────────────────────
    add_heading_1(doc, "5. Database Schema & Relational Architecture")
    add_paragraph(doc, "The cloud relational schema in Supabase PostgreSQL guarantees ACID transactions, relational foreign key constraints, and user isolation via RLS:")

    schema_table = doc.add_table(rows=7, cols=3)
    schema_headers = ["Table Name", "Primary / Foreign Keys", "Stored Fields & Data Attributes"]
    for j, h in enumerate(schema_headers):
        schema_table.rows[0].cells[j].paragraphs[0].add_run(h)

    schemas = [
        ("public.users", "PK: id (uuid -> auth.users)", "email, display_name, currency (default 'USD'/'INR'), created_at."),
        ("public.trips", "PK: id (uuid)\nFK: user_id -> users(id)", "destination, from_city, start_date, end_date, total_budget, group_size, trip_style, itinerary_json, weather_json, share_token, offbeat_preference."),
        ("public.wardrobe_items", "PK: id (uuid)\nFK: user_id -> users(id)", "image_url, category, color, embedding (vector(1536)), suitability_score, description, color_tags."),
        ("public.expenses", "PK: id (uuid)\nFK: trip_id -> trips(id)", "label, amount, currency, paid_by, category, created_at."),
        ("public.journal_entries", "PK: id (uuid)\nFK: trip_id -> trips(id)", "date, text, photos (jsonb array), created_at."),
        ("public.chat_messages", "PK: id (uuid)\nFK: trip_id -> trips(id)", "role ('user'|'assistant'|'system'), content, created_at.")
    ]
    for idx, row_data in enumerate(schemas):
        row = schema_table.rows[idx + 1]
        for col_idx, val in enumerate(row_data):
            row.cells[col_idx].paragraphs[0].add_run(val)
    format_table(schema_table, col_widths=[Inches(1.8), Inches(2.0), Inches(3.0)])

    # ─────────────────────────────────────────────────────────────────
    # SECTION 6: API MICROSERVICE CONTRACTS
    # ─────────────────────────────────────────────────────────────────
    add_heading_1(doc, "6. Edge API Microservices & Contracts")
    add_paragraph(doc, "All serverless handlers in `/api/*` run on Node.js / Vercel Serverless with standard JSON request/response envelopes:")
    add_bullet(doc, "POST /api/calculate-budget", "Calculates INR categorical budget allocations across Stay, Travel, Food, and Activities.")
    add_bullet(doc, "POST /api/get-weather", "Fetches 5-day temperature forecasts, precipitation probability, and weather alerts.")
    add_bullet(doc, "POST /api/get-transport-options", "Computes transit distance (km) and comparative train/bus fare tiers.")
    add_bullet(doc, "POST /api/chat-concierge", "Dispatches user query to LangChain and returns conversational advice and structured client action payloads.")

    doc.save(output_path)
    print(f"Successfully generated System Design & UI/UX Document: {output_path}")

if __name__ == "__main__":
    os.makedirs("docs", exist_ok=True)
    root_out = "Trip_Drip_Design_Document.docx"
    docs_out = os.path.join("docs", "Trip_Drip_Design_Document.docx")
    build_design_document(root_out)
    shutil.copy(root_out, docs_out)
    print(f"Copied to {docs_out}")
