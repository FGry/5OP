package com.fiveop.enity;

public enum CompanyScale {
    STARTUP("Startip (1 - 10 nhân viên)"),
    SMALL("Nhỏ (10-50 nhân viên)"),
    MEDIUM("Vừa (50-200 nhân viên)"),
    LARGE("Lớn (200-1000 nhân viên)"),
    ENTERPRISE("Tập đoàn (>1000 nhân viên)");
    private final String displayValue;
    CompanyScale(String displayValue){
        this.displayValue = displayValue;
    }
    private String getDisplayValue(){
        return displayValue;
    }
}
