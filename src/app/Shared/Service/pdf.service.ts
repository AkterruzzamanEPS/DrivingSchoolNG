
import { Injectable } from '@angular/core';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

(<any>pdfMake).addVirtualFileSystem(pdfFonts);


@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor() {
   }
   
  // generatePdf(documentDefinition: any) {
  //   pdfMake.createPdf(documentDefinition).open();
  // }

  generatePdf(documentDefinition: any) {
    console.log(pdfMake); // Debug line to check if pdfMake is defined
    if (pdfMake && pdfMake.createPdf) {
      pdfMake.createPdf(documentDefinition).open();
    } else {
      console.error('pdfMake is not properly loaded.');
    }
  }

  DownloadPdf(documentDefinition: any,fileName:string) {
    console.log(pdfMake); // Debug line to check if pdfMake is defined
    if (pdfMake && pdfMake.createPdf) {
      pdfMake.createPdf(documentDefinition).download(fileName+'.pdf'); // Downloads the file
    } else {
      console.error('pdfMake is not properly loaded.');
    }
  }
  
  public getNameToKeyWise(keyProperty: any, valueProperty: any,key:any, list: any[], defaultValue: any): any {
    let name = defaultValue;
    let findDate = list.find(x => x[keyProperty] == key);
    if (findDate) {
      name = findDate[valueProperty]
    }
    return name;
  }
  
}
