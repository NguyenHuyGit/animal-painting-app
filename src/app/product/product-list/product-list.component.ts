import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { Product } from 'src/app/models/product';
import { CartService } from 'src/app/cart/cart.service';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  public listProducts : Product [] = [];
  filterProducts : Product[] = [];
  sortOrder: string = "";

  constructor(private productService: ProductService,
              private cartService : CartService,
              private snackBar : MatSnackBar
            )
  {

  }
  ngOnInit(): void {
    this.productService.getProducts().subscribe(products => {
      this.listProducts = products;
      this.filterProducts = products;
    });
  }

  addToCart(product: Product):void {
    this.cartService.addToCart(product).subscribe({
      next: () => {
        this.snackBar.open("Product added to card","",{
          duration: 2000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
      }
    });
  }

  applyFilter(event : Event): void {
    let searchTerm = (event.target as HTMLInputElement).value;
    searchTerm = searchTerm.toLowerCase();

    this.filterProducts = this.listProducts.filter(product => product.name.toLowerCase().includes(searchTerm));
    
    //call method sort product again
    this.sortProduct(this.sortOrder)
  }

  sortProduct(sortValue: string) {
    this.sortOrder = sortValue;
    
    if(this.sortOrder === "priceLowHigh") {
      this.filterProducts.sort((a,b)=> a.price - b.price) 
    }else if(this.sortOrder === "priceHighLow") {
      this.filterProducts.sort((a,b)=> b.price - a.price) 
    }
  }
}
