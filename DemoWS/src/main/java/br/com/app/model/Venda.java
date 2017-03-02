/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package br.com.app.model;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Collection;
import java.util.Date;
import javax.persistence.Basic;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.OneToMany;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.NotNull;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlTransient;

/**
 *
 * @author Lucas
 */
@Entity
@Table(name = "venda")
@XmlRootElement
@NamedQueries({
    @NamedQuery(name = "Venda.findAll", query = "SELECT v FROM Venda v"),
    @NamedQuery(name = "Venda.findById", query = "SELECT v FROM Venda v WHERE v.id = :id"),
    @NamedQuery(name = "Venda.findByDtVenda", query = "SELECT v FROM Venda v WHERE v.dtVenda = :dtVenda"),
    @NamedQuery(name = "Venda.findByValorTotal", query = "SELECT v FROM Venda v WHERE v.valorTotal = :valorTotal")})

public class Venda implements Serializable {

    private static final long serialVersionUID = 1L;
    @SequenceGenerator(name = "venda_seq", sequenceName="venda_seq", initialValue = 1, allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Id
    @Column(name = "id")
    private Long id;
    @Basic(optional = false)
    @NotNull
    @Column(name = "dt_venda")
    @Temporal(TemporalType.TIMESTAMP)
    private Date dtVenda;
    // @Max(value=?)  @Min(value=?)//if you know range of your decimal fields consider using these annotations to enforce field validation
    @Basic(optional = false)
    @NotNull
    @Column(name = "valor_total")
    private BigDecimal valorTotal;
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "idVenda")
    private Collection<VendaItem> vendaItemCollection;

    public Venda() {
    }

    public Venda(Long id) {
        this.id = id;
    }

    public Venda(Long id, Date dtVenda, BigDecimal valorTotal) {
        this.id = id;
        this.dtVenda = dtVenda;
        this.valorTotal = valorTotal;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Date getDtVenda() {
        return dtVenda;
    }

    public void setDtVenda(Date dtVenda) {
        this.dtVenda = dtVenda;
    }

    public BigDecimal getValorTotal() {
        return valorTotal;
    }

    public void setValorTotal(BigDecimal valorTotal) {
        this.valorTotal = valorTotal;
    }

    @XmlTransient
    public Collection<VendaItem> getVendaItemCollection() {
        return vendaItemCollection;
    }

    public void setVendaItemCollection(Collection<VendaItem> vendaItemCollection) {
        this.vendaItemCollection = vendaItemCollection;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (id != null ? id.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof Venda)) {
            return false;
        }
        Venda other = (Venda) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "br.com.app.model.Venda[ id=" + id + " ]";
    }

}
