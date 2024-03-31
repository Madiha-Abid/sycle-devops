import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { categoryList, cityList, coloursList, conditionList, sizeList, subCategoryList } from "../../models/models";
import { useState } from "react";

export type FilterDialogProps = {
    filterDialogOpen: boolean,
    setFilterDialogOpen: (value: boolean) => void,
    productFilters: ProductFilters,
    setProductFilters: (value: ProductFilters) => void
}

//All will indicate that filter is not applied
export type ProductFilters = {
    category: string,
    subCategory: string,
    colour: string,
    size: string,
    city: string
}

export const allItemsId = "All"
function FilterDialog(props: FilterDialogProps) {

    const onClose = () => props.setFilterDialogOpen(false)

    const [currentProductFilters, setCurrentProductFilters] = useState<ProductFilters>(props.productFilters);

    const onFilterChange = (filterKey: string, event: SelectChangeEvent) => {
        //merge product filters with new value for the filter key
        const updatedFilters = {
            ...currentProductFilters, //this equivalent to setting stuff like category: productsFilter.category and the rest of the properties
            [filterKey]: event.target.value as string
          }
        //props.setProductFilters(updatedFilters)
        setCurrentProductFilters(updatedFilters)
        console.log("updated filters", updatedFilters)
      }

    const onCancel = () => {
        onClose()
        setCurrentProductFilters(props.productFilters)
    }

    const onConfirm = () => {
        props.setProductFilters(currentProductFilters)
        onClose()
    }

    return (
        <Dialog open={props.filterDialogOpen} onClose={onClose}>
            <DialogTitle>Filter Products</DialogTitle>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <DialogContentText>
                    Select from the following options to filter the products
                </DialogContentText>
                <FormControl>
                    <InputLabel id="category-label">Category</InputLabel>
                    <Select
                        labelId="category-label"
                        id="category-select"
                        label="Category"
                        value = {currentProductFilters.category}
                        onChange={(event) => onFilterChange("category", event)}
                    >
                        {
                            [allItemsId, ...categoryList].map(category => <MenuItem key={category} value={category}>{category}</MenuItem>)
                        }
                    </Select>
                </FormControl>

                <FormControl>
                    <InputLabel id="sub-category-label">Sub Category</InputLabel>
                    <Select
                        labelId="sub-category-label"
                        id="sub-category-select"
                        label="Sub Category"
                        value = {currentProductFilters.subCategory}
                        onChange={(event) => onFilterChange("subCategory", event)}

                    >
                        {
                            [allItemsId, ...subCategoryList].map(category => <MenuItem key = {category} value={category}>{category}</MenuItem>)
                        }
                    </Select>
                </FormControl>

                <FormControl>
                    <InputLabel id="size-label">Size</InputLabel>
                    <Select
                        labelId="size-label"
                        id="size-select"
                        label="Size"
                        value = {currentProductFilters.size}
                        onChange={(event) => onFilterChange("size", event)}

                    >
                        {
                            [allItemsId, ...sizeList].map(size => <MenuItem key = {size} value={size}>{size}</MenuItem>)
                        }
                    </Select>
                </FormControl>

                <FormControl>
                    <InputLabel id="colour-label">Colour</InputLabel>
                    <Select
                        labelId="colour-label"
                        id="colour-select"
                        label="Colour"
                        value = {currentProductFilters.colour}
                        onChange={(event) => onFilterChange("colour", event)}

                    >
                        {
                            [allItemsId, ...coloursList].map(colour => <MenuItem key = {colour} value={colour}>{colour}</MenuItem>)
                        }
                    </Select>
                </FormControl>
                <FormControl>
                    <InputLabel id="city-label">City</InputLabel>
                    <Select
                        labelId="city-label"
                        id="city-select"
                        label="City"
                        value = {currentProductFilters.city}
                        onChange={(event) => onFilterChange("city", event)}

                    >
                        {
                            [allItemsId, ...cityList].map(city => <MenuItem key={city} value={city}>{city}</MenuItem>)
                        }
                    </Select>
                </FormControl>

            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel}>Cancel</Button>
                <Button onClick={onConfirm}>Filter</Button>
            </DialogActions>
        </Dialog>
    )
}

export default FilterDialog