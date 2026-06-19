import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Split the HTML by section
chapters = re.split(r'(<div class="chapter" id="chapter-\d+"[^>]*>)', html)

out_html = chapters[0]

for i in range(1, len(chapters), 2):
    chap_div = chapters[i]
    chap_content = chapters[i+1]
    
    chap_num_match = re.search(r'id="chapter-(\d+)"', chap_div)
    if not chap_num_match:
        out_html += chap_div + chap_content
        continue
        
    chap_num = chap_num_match.group(1)
    
    grid_start = chap_content.find('<div class="tile-grid">')
    if grid_start == -1:
        out_html += chap_div + chap_content
        continue
        
    grid_end = chap_content.find('</section>', grid_start)
    
    grid_full = chap_content[grid_start:grid_end]
    
    # We will manually extract the 4 <div class="glass-tile"> blocks.
    # We find all indices of '<div class="glass-tile'
    indices = [m.start() for m in re.finditer(r'<div class="glass-tile', grid_full)]
    
    if len(indices) != 4:
        out_html += chap_div + chap_content
        continue
        
    tiles = []
    for j in range(4):
        start_idx = indices[j]
        end_idx = indices[j+1] if j < 3 else grid_full.rfind('</div>', 0, grid_full.rfind('</div>')) + 6
        tiles.append(grid_full[start_idx:end_idx])
        
    grid_suffix = grid_full[len(grid_full[:indices[0]] + "".join(tiles)):]
    # grid_suffix should just be \n                </div>\n            
    grid_suffix = '\n                </div>\n            '
    
    ordered_tiles = [None]*4
    for t in tiles:
        if 'Summary' in t:
            ordered_tiles[0] = t
        elif 'learnt' in t.lower() or 'learned' in t.lower() or 'Key Terms' in t:
            ordered_tiles[3] = t
        elif 'Opinion' in t:
            ordered_tiles[2] = t
        elif 'Details' in t or 'Content Metadata' in t:
            ordered_tiles[1] = t
            
    labels = ["Summary", "Details", "My Opinion", "What I have learnt"]
    final_tiles = []
    
    for j in range(4):
        t = ordered_tiles[j]
        if t is None:
            t = tiles[j] # fallback
            
        # Fix stagger class
        t = re.sub(r'<div class="glass-tile(?: stagger)?">', 
                   '<div class="glass-tile stagger">' if j % 2 == 1 else '<div class="glass-tile">', 
                   t, count=1)
                   
        # Fix ref number
        t = re.sub(r'<span class="ref">[^<]+</span>', f'<span class="ref">{chap_num}.{j+1} {labels[j]}</span>', t)
        
        final_tiles.append(t)
        
    new_grid_full = '<div class="tile-grid">\n                    ' + "".join(final_tiles) + grid_suffix
    
    out_html += chap_div + chap_content[:grid_start] + new_grid_full + chap_content[grid_end:]

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(out_html)
