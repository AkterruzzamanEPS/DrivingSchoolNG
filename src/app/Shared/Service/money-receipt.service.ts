import { inject, Injectable } from '@angular/core';
import { HttpHelperService } from './http-helper.service';
import { PdfService } from './pdf.service';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class MoneyReceiptService {

  constructor(
     private http: HttpHelperService,
     private pdfService: PdfService,
  ) { }

  
  public result: any[] = [];



  GenerateMoneyReceiptPDF(PaymentID: number) {

    this.http.Get(`Payment/GetPaymentReceiptById/${PaymentID}`).subscribe(
      (res: any) => {
        var payment = res;
        const docDef = {
          content: [
            { text: 'MONEY RECEIPT', style: 'header', alignment: 'center' },
            { text: 'Receipt No: ' + payment.receiptNo, style: 'subheader' },
            { text: 'Date: ' +payment.transactionDateSt  , style: 'subheader' },
            { text: ' ' },
            {
              style: 'tableExample',
              table: {
                widths: ['*', '*'],
                body: [
                  ['Reg No', '' + payment.studentIdNo],
                  ['Student Name', '' + payment.userName],
                  ['Total Amount', '' + payment.totalAmount],
                  ['Paid Amount', '' + payment.paidAmount],
                  ['Due Amount', ''+ payment.dueAmount],
                ]
              },
              layout: 'lightHorizontalLines'
            },
            { text: ' ', margin: [0, 10] },
            {
              columns: [
                { text: 'Signature', alignment: 'right', margin: [0, 20, 40, 0] }
              ]
            }
          ],
          styles: {
            header: { fontSize: 18, bold: true },
            subheader: { fontSize: 12, margin: [0, 5] },
            tableExample: { margin: [0, 10, 0, 15] }
          }
        };

        // Generate PDF using pdfMake
        this.pdfService.generatePdf(docDef);

      },
      (err) => {
      });
  }
}
