import { Injectable } from '@angular/core';
declare var $: any;

@Injectable() 
export class TableExportService {

    constructor() {}

    exportTo(format: string, tableId: string): void {

    if (format === 'json') {
      $('#'+tableId).tableExport({
        type: 'json',
        escape: 'false'
      });
    } else if (format === 'xml') {
      $('#'+tableId).tableExport({
        type: 'xml',
        escape: 'false'
      });
    } else if (format === 'pdf') {
      $('#'+tableId).tableExport({
        type: 'jspdf',
        pdfFontSize: '7',
        escape: 'false'
      });
    } else if (format === 'sql') {
      $('#'+tableId).tableExport({
        type: 'sql',
        escape: 'false'
      });
    } else if (format === 'csv') {
      $('#'+tableId).tableExport({
        type: 'csv',
        escape: 'false'
      });
    } else if (format === 'txt') {
      $('#'+tableId).tableExport({
        type: 'txt',
        escape: 'false'
      });
    } else if (format === 'xls') {
      $('#'+tableId).tableExport({
        type: 'excel',
        escape: 'false'
      });
    }

  }
}