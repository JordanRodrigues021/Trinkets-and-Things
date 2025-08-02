# Bulk Import/Export Guide

## CSV Format Specifications

The admin panel supports bulk import and export of products using CSV format.

### CSV Structure

```csv
name,description,price,category,material,dimensions,weight,print_time,colors,images,featured
```

### Field Descriptions

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `name` | String | Product name | "Premium Phone Stand" |
| `description` | String | Product description | "Adjustable ergonomic phone stand..." |
| `price` | Decimal | Price in dollars | 29.99 |
| `category` | Enum | functional, artistic, or prototypes | functional |
| `material` | String | 3D printing material | PETG |
| `dimensions` | String | Product dimensions | "12cm × 8cm × 10cm" |
| `weight` | String | Product weight | 180g |
| `print_time` | String | Estimated print time | "5 hours" |
| `colors` | String Array | Available colors (semicolon-separated) | "Black;White;Red" |
| `images` | String Array | Image URLs (semicolon-separated) | "url1;url2;url3" |
| `featured` | Integer | Featured status (0=normal, 1=featured, 2=highly featured) | 0 |

### Important Notes

1. **String Quoting**: Use double quotes for text fields containing commas or special characters
2. **Array Fields**: Use semicolons (;) to separate multiple values in colors and images fields
3. **Categories**: Must be exactly "functional", "artistic", or "prototypes"
4. **Featured Values**: Must be 0, 1, or 2
5. **Required Fields**: name, description, price, category, material, dimensions, weight, print_time

### Sample CSV File

A sample CSV file is available in the admin panel. Click "Sample CSV" to download it.

## Using Import/Export

### Export Products
1. Go to Admin Dashboard > Products tab
2. Click "Export CSV" button
3. File will download as `products-export-YYYY-MM-DD.csv`

### Import Products
1. Prepare your CSV file following the format above
2. Go to Admin Dashboard > Products tab  
3. Click "Import CSV" button
4. Select your CSV file
5. Products will be added to the database
6. Success/error notifications will appear

### Error Handling

- Invalid file types will be rejected
- Malformed CSV rows will be skipped
- Missing required fields will cause validation errors
- Database errors will be displayed with specific messages

### Tips for Success

1. Download the sample CSV as a template
2. Export existing products to see the correct format
3. Test with a small batch first
4. Ensure image URLs are publicly accessible
5. Validate your CSV format before importing

## Security Considerations

- Only CSV files are accepted for import
- All data is validated before database insertion
- Malicious content in descriptions is not automatically sanitized
- Ensure trusted sources for imported data